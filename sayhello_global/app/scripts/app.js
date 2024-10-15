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
 * Create a Freshdesk ticket to say hello
 *
 * @param {String} agentName - The name of the logged in agent
 */
async function createfdTicket(agentName) {
  const ticketDetails = JSON.stringify({
    email: 'puppycat@email.com',
    subject: 'Hello',
    priority: 1,
    description: `Hey ${agentName} 👋, First HELLO always inspires!`,
    status: 2
  });
  // Send request
  await client.request.invokeTemplate("createfdTicket", {
    body: ticketDetails
  });
}

/**
 * Create a Freshservice ticket to say hello
 *
 * @param {String} agentName - The name of the logged in agent
 */
async function createfsTicket(agentName) {
  const ticketDetails=JSON.stringify({
      "description": "Details about the issue...",
      "subject": "Support Needed for " + agentName,
      "email": "tom@outerspace.com",
      "priority": 1,
      "status": 2,
      "cc_emails": [
        "ram@freshservice.com",
        "diana@freshservice.com"
      ],
      "workspace_id": 2
    });
    // Send request
  await client.request.invokeTemplate("createfsTicket", {
    body: ticketDetails
  });
}

/**
 * To let Freshdesk say hello through ticket
 *
 * @param {String} agentName - The name of the logged in agent
 */
async function sayHello(agentName, isFreshDesk) {
  try {
    // Try creating a ticket
    if(isFreshDesk){
      await createfdTicket(agentName);
    }
    else{
      await createfsTicket(agentName);
    }
    

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
    let isFreshDesk = data.loggedInUser.hasOwnProperty("availability");
    let agentName = isFreshDesk ? data.loggedInUser.contact.name : data.loggedInUser.user.name; 
    let productName = isFreshDesk ? "to FreshDesk" : "to Freshservice";
    document.getElementById("agentName").textContent = `Hello ${agentName},`;
    document.getElementById("fd-product").textContent = productName;
    document.getElementById('btnSayHello').removeEventListener('fwClick',function () {
      sayHello(agentName, isFreshDesk);
    });
    document.getElementById("btnSayHello").addEventListener("fwClick", function () {
      sayHello(agentName, isFreshDesk);
    });
  },
    function (error) {
      console.error("Error: Failed to fetch loggedInUser details");
      console.error(error);
    }
  );
}

document.onreadystatechange = function () {
  if (document.readyState === 'complete') renderApp();

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
