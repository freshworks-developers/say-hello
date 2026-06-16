import { beforeEach, describe, expect, test, vi } from "vitest";

const mockClient = {
  events: {
    on: vi.fn()
  },
  data: {
    get: vi.fn()
  },
  interface: {
    trigger: vi.fn(() => Promise.resolve())
  },
  request: {
    invokeTemplate: vi.fn(() => Promise.resolve({ status: 201 }))
  }
};

global.app = {
  initialized: vi.fn(() => Promise.resolve(mockClient))
};

global.customElements = {
  whenDefined: vi.fn(() => Promise.resolve())
};

function flushPromises() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0);
  });
}

function loadApp() {
  return import("../app/scripts/app.js");
}

describe("app.js", function () {
  beforeEach(function () {
    vi.resetModules();
    vi.clearAllMocks();

    document.body.innerHTML = `
      <fw-label id="productBadge"></fw-label>
      <p id="agentName"></p>
      <p id="fd-product"></p>
      <fw-button id="btnSayHello"></fw-button>
      <fw-label id="newTicketBanner"></fw-label>
      <p id="init-error" hidden></p>
    `;

    mockClient.data.get.mockImplementation(function (key) {
      if (key === "loggedInUser") {
        return Promise.resolve({
          loggedInUser: {
            contact: { name: "Jane Agent" },
            ticket_scope: 1
          }
        });
      }

      if (key === "currentHost") {
        return Promise.resolve({
          currentHost: {
            endpoint_urls: {
              product: "https://acme.freshdesk.com"
            }
          }
        });
      }

      return Promise.reject(new Error("Unexpected data key: " + key));
    });
  });

  test("initializes the app client on load", async function () {
    await loadApp();
    await flushPromises();

    expect(global.app.initialized).toHaveBeenCalled();
    expect(mockClient.events.on).toHaveBeenCalledWith("app.activated", expect.any(Function));
  });

  test("renders agent greeting for Freshdesk", async function () {
    await loadApp();
    await flushPromises();

    const activateHandler = mockClient.events.on.mock.calls[0][1];
    await activateHandler();

    expect(document.getElementById("agentName").textContent).toBe("Hello Jane Agent,");
    expect(document.getElementById("productBadge").getAttribute("value")).toBe("Freshdesk");
  });

  test("creates a Freshdesk ticket when Say Hello is clicked", async function () {
    await loadApp();
    await flushPromises();

    const activateHandler = mockClient.events.on.mock.calls[0][1];
    await activateHandler();

    const button = document.getElementById("btnSayHello");
    button.dispatchEvent(new CustomEvent("fwClick"));
    await flushPromises();
    await flushPromises();

    expect(mockClient.request.invokeTemplate).toHaveBeenCalledWith(
      "createfdTicket",
      expect.objectContaining({
        body: expect.stringContaining("Jane Agent")
      })
    );
    expect(mockClient.interface.trigger).toHaveBeenCalledWith(
      "showNotify",
      expect.objectContaining({ type: "success" })
    );
  });
});
