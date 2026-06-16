(function () {
  let client;
  let sayHelloHandler = null;
  let isBusy = false;

  function showNotification(type, title, message) {
    return client.interface.trigger("showNotify", {
      type: type,
      title: title,
      message: message
    });
  }

  function showBanner(text) {
    const banner = document.getElementById("newTicketBanner");
    if (!banner) {
      return;
    }

    if (text) {
      banner.setAttribute("value", text);
      banner.style.display = "block";
    } else {
      banner.setAttribute("value", "");
      banner.style.display = "none";
    }
  }

  function showInitError(message) {
    const banner = document.getElementById("init-error");
    if (banner) {
      banner.hidden = false;
      banner.textContent = message;
    }
  }

  function setButtonLoading(loading) {
    const button = document.getElementById("btnSayHello");
    if (!button) {
      return;
    }

    if (loading) {
      button.setAttribute("loading", "");
      button.setAttribute("disabled", "");
    } else {
      button.removeAttribute("loading");
      button.removeAttribute("disabled");
    }
  }

  function detectIsFreshdesk(currentHost, loggedInUser) {
    const productUrl = (currentHost.endpoint_urls && currentHost.endpoint_urls.product) || "";
    const hostname = window.location.hostname || "";
    const onFreshdesk = /freshdesk/i.test(productUrl) || /freshdesk/i.test(hostname);
    const onFreshservice = /freshservice/i.test(productUrl) || /freshservice/i.test(hostname);

    if (onFreshdesk) {
      return true;
    }

    if (onFreshservice) {
      return false;
    }

    return Boolean(loggedInUser && Object.hasOwn(loggedInUser, "ticket_scope"));
  }

  function getAgentName(loggedInUser) {
    if (loggedInUser.contact && loggedInUser.contact.name) {
      return loggedInUser.contact.name;
    }

    if (loggedInUser.user && loggedInUser.user.name) {
      return loggedInUser.user.name;
    }

    return "there";
  }

  function getErrorMessage(error) {
    if (!error) {
      return "Unknown error";
    }

    if (error.message) {
      return error.message;
    }

    if (!error.response) {
      return String(error);
    }

    try {
      const parsed = JSON.parse(error.response);
      if (parsed.errors && parsed.errors.length) {
        return parsed.errors.map(function (item) {
          return item.message || item.code;
        }).join(", ");
      }

      return parsed.description || String(error.response);
    } catch {
      return String(error.response);
    }
  }

  async function createfdTicket(agentName) {
    const ticketDetails = JSON.stringify({
      email: "puppycat@email.com",
      subject: "Hello",
      priority: 1,
      description: "Hey " + agentName + " 👋, First HELLO always inspires!",
      status: 2
    });

    const result = await client.request.invokeTemplate("createfdTicket", {
      body: ticketDetails
    });

    if (result && result.status >= 400) {
      throw new Error("Freshdesk API returned status " + result.status);
    }

    return result;
  }

  async function createfsTicket(agentName) {
    const ticketDetails = JSON.stringify({
      description: "Hey " + agentName + " 👋, First HELLO always inspires!",
      subject: "Support Needed for " + agentName,
      email: "tom@outerspace.com",
      priority: 1,
      status: 2
    });

    const result = await client.request.invokeTemplate("createfsTicket", {
      body: ticketDetails
    });

    if (result && result.status >= 400) {
      throw new Error("Freshservice API returned status " + result.status);
    }

    return result;
  }

  async function sayHello(agentName, isFreshDesk) {
    if (isBusy) {
      return;
    }

    const productLabel = isFreshDesk ? "Freshdesk" : "Freshservice";
    isBusy = true;
    setButtonLoading(true);
    showBanner("");

    try {
      if (isFreshDesk) {
        await createfdTicket(agentName);
      } else {
        await createfsTicket(agentName);
      }

      console.info("Successfully created ticket in " + productLabel);
      await showNotification(
        "success",
        "Hello ticket created",
        "Successfully created a ticket to say hello."
      );
      showBanner(productLabel + " talks in tickets — check for the new ticket.");
    } catch (error) {
      const detail = getErrorMessage(error);
      console.error("Error: Failed to create a ticket", error);
      await showNotification(
        "danger",
        "Ticket creation failed",
        detail
      );
      showBanner("");
    } finally {
      isBusy = false;
      setButtonLoading(false);
    }
  }

  async function onAppActivate() {
    try {
      await Promise.all([
        customElements.whenDefined("fw-button"),
        customElements.whenDefined("fw-label")
      ]);
    } catch (error) {
      console.warn("Crayons components not ready", error);
    }

    try {
      const userData = await client.data.get("loggedInUser");
      const hostData = await client.data.get("currentHost");
      const loggedInUser = userData.loggedInUser;
      const isFreshDesk = detectIsFreshdesk(hostData.currentHost, loggedInUser);
      const agentName = getAgentName(loggedInUser);
      const productLabel = isFreshDesk ? "Freshdesk" : "Freshservice";

      document.getElementById("agentName").textContent = "Hello " + agentName + ",";
      document.getElementById("fd-product").textContent =
        "Click below and " + productLabel + " will respond with a new ticket.";
      document.getElementById("productBadge").setAttribute("value", productLabel);

      const button = document.getElementById("btnSayHello");
      if (sayHelloHandler) {
        button.removeEventListener("fwClick", sayHelloHandler);
      }

      sayHelloHandler = function () {
        sayHello(agentName, isFreshDesk);
      };
      button.addEventListener("fwClick", sayHelloHandler);
    } catch (error) {
      console.error("Error: Failed to fetch app context", error);
      showInitError("Could not load agent details. Reload the page and try again.");
      await showNotification(
        "danger",
        "App setup error",
        "Failed to load agent or product context."
      );
    }
  }

  app.initialized().then(function (_client) {
    client = _client;
    window.client = _client;
    client.events.on("app.activated", onAppActivate);
  }).catch(function (error) {
    console.error("Error: Failed to initialise the app", error);
    showInitError("App failed to initialize. Reload with ?dev=true and check the console.");
  });
})();
