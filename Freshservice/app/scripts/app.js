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
    console.info("Successfully created ticket in Freshservice");
    showNotification("success", "Successfully created a ticket to say hello");
    showBanner("Freshservice talks in tickets, check for new ticket.");
  } catch (error) {
    // If failed...
    console.error("Error: Failed to create a ticket");
    console.error(error);
    showNotification("danger", "Failed to create a ticket.");
  }
}

/**
 * Creates a ticket with predefined details
 */
async function createTicket() {
  // Predefined ticket details
  const ticketDetails = {
    email: "puppycat@email.com",
    subject: `Hello`,
    priority: 1,
    description: `Hey ${agentName} 👋, First HELLO always inspires!`,
    status: 2,
  };

  // Invoke Freshworks API to create a ticket
  await client.request.invokeTemplate("createTicket", {
    body: JSON.stringify(ticketDetails)
  });
}

/**
 * Shows a notification using Freshworks API
 *
 * @param {String} type - type of the notification
 * @param {String} message - content to be shown in the notification
 */
function showNotification(type, message) {
  return client.interface.trigger("showNotify", {
    type: type,
    message: message,
  });
}

/**
 * Updates the banner with the given value
 *
 * @param {String} value - content to be displayed in the banner
 */
function showBanner(value) {
  // Update the banner content
  document.getElementById("newTicketBanner").value = value;
}

/**
 * Handles the app activation event
 */
function onAppActivate() {
  // Fetch logged-in user details
  client.data.get("loggedInUser").then(
    function (data) {
      // Set agent name and update UI
      window.agent = data.loggedInUser.user.name;
      document.getElementById("agentName").textContent = `Hello ${agent},`;

      // Attach 'sayHello' function to a button click event
      document
        .getElementById("btnSayHello")
        .addEventListener("fwClick", sayHello);
    },
    function (error) {
      // If failed to fetch user details
      console.error("Error: Failed to fetch loggedInUser details");
      console.error(error);
    }
  );
}

// Wait for document to be interactive and then render the app
document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();

  /**
   * Initializes the app and sets up event listeners
   */
  function renderApp() {
    // Initialize Freshworks app
    var onInit = app.initialized();

    // Get client instance on initialization
    onInit.then(getClient).catch(function (error) {
      console.error("Error: Failed to initialize the app");
      console.error(error);
    });

    /**
     * Sets the client instance and attaches event listeners
     * @param {Object} _client - Freshworks client instance
     */
    function getClient(_client) {
      window.client = _client;

      // Attach 'onAppActivate' function to the Freshworks app activation lifecycle event
      client.events.on("app.activated", onAppActivate);
    }
  }
};
