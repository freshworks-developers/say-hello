/**
 * Show a notification toast with the given type and message
 *
 * @param {String} type - type of the notification
 * @param {String} message - content to be shown in the notification
 **/
async function sayHello() {
  try {
    // Try creating a ticket
    await createTicket();

    // If successful...
    console.info("Successfully created ticket in Freshdesk");
    showNotification("success", "Successfully created a ticket to say hello");
    showBanner("Freshdesk talks in tickets, check for new ticket.");
  } catch (error) {
    // If failed...
    console.error("Error: Failed to create a ticket");
    console.error(error);
    showNotification("danger", "Failed to create a ticket.");
  }
}

async function createTicket() {
  const ticketURL =
    "https://<%= iparam.freshdesk_subdomain %>.freshdesk.com/api/v2/tickets";

  const ticketDetails = {
    email: "puppycat@email.com",
    subject: `Hey ${agent} 👋, First HELLO always inspires!`,
    priority: 1,
    description: "👋, Weirdest Hello World ever 👀!!",
    status: 2,
  };

  const options = {
    headers: {
      Authorization: "Basic <%= encode(iparam.freshdesk_api_key) %>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticketDetails),
    method: "POST",
  };

  // Send request
  await client.request.post(ticketURL, options);
}

function showNotification(type, message) {
  return client.interface.trigger("showNotify", {
    type: type,
    message: message,
  });
}

function showBanner(value) {
  document.getElementById("newTicketBanner").value = value;
}

function onAppActivate() {
  client.data.get("loggedInUser").then(
    function (data) {
      window.agent = data.loggedInUser.contact.name;
      document.getElementById("agentName").textContent = `Hello ${agent},`;
      document
        .getElementById("btnSayHello")
        .addEventListener("fwClick", sayHello);
    },
    function (error) {
      console.error("Error: Failed to fetch loggedInUser details");
      console.error(error);
    }
  );
}

document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(function (error) {
      console.error("Error: Failed to initialize the app");
      console.error(error);
    });

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};
