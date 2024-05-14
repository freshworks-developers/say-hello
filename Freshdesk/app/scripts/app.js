/**
 * Show a notification toast with the given type and message
 *
 * @param {String} type - type of the notification
 * @param {String} message - content to be shown in the notification
 **/
function showNotification(type, message) {
  return client.interface.trigger("showNotify", {
    type: type,
    message: message
  });
}

/**
 * Show a banner with the given text within the app
 *
 * @param {String} text - Text to be shown in the banner
 */
function showBanner(text) {
  document.getElementById("newTicketBanner").value = text;
}


/**
 * Create a ticket to say hello
 *
 * @param {String} agentName - The name of the logged in agent
 */
async function createTicket(agentName) {
  const ticketDetails = JSON.stringify({
    email: 'puppycat@email.com',
    subject: 'Hello',
    priority: 1,
    description: `Hey ${agentName} 👋, First HELLO always inspires!`,
    status: 2
  });
  // Send request
  await client.request.invokeTemplate("createTicket", {
    body: ticketDetails
  });
}

/**
 * To let Freshdesk say hello through ticket
 *
 * @param {String} agentName - The name of the logged in agent
 */
async function sayHello(agentName) {
  try {
    // Try creating a ticket
    await createTicket(agentName);

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

function onAppActivate() {
  client.data.get("loggedInUser").then(function (data) {
    document.getElementById("agentName").textContent = `Hello ${data.loggedInUser.contact.name},`;
    document.getElementById('btnSayHello').removeEventListener('fwClick');
    document.getElementById("btnSayHello").addEventListener("fwClick", function () {
      sayHello(data.loggedInUser.contact.name);
    });
  },
    function (error) {
      console.error("Error: Failed to fetch loggedInUser details");
      console.error(error);
    }
  );
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(function (_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }).catch(function (error) {
      console.error('Error: Failed to initialise the app');
      console.error(error);
    });
  }
};
