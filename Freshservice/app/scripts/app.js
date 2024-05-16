/**
 * Show a notification toast with the given type and message
 *
 * @param {String} type - type of the notification
 * @param {String} message - content to be shown in the notification
 **/
async function sayHello() {
  console.log('sayHello btn click');
  try {
    await createTicket();
    console.info("Successfully created ticket in Freshservice");
    showNotification("success", "Successfully created a ticket to say hello");
    showBanner("Freshservice talks in tickets, check for new ticket.");
  } catch (error) {
    console.error("Error: Failed to create a ticket");
    console.error(error);
    showNotification("danger", "Failed to create a ticket.");
  }
}

/**
 * Say hello to GitHub by creating an issue in the configured repository
 */
async function helloGitHub() {
  try {
    await createGitHubIssue();
    console.info("Successfully created issue in GitHub");
    showNotification("success", "Successfully created an issue to say hello to GitHub");
  } catch (error) {
    console.error("Error: Failed to create a GitHub issue");
    console.error(error);
    showNotification("danger", "Failed to create a GitHub issue.");
  }
}

/**
 * Create a GitHub issue by making an API request with OAuth
 */
async function createGitHubIssue() {
  try {
    await client.request.invokeTemplate('createGitHubIssue', {
      context: {},
      body: JSON.stringify({
        "title": "Multi OAuth demo issue",
        "body": "I'm having a problem with this."
      })
    });
  } catch (error) {
    console.error('Error: Failed to create GitHub issue');
    console.error(error);
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
  console.log("onAppActivate");
  // Fetch logged-in user details
  client.data.get("loggedInUser").then(
    function (data) {
      // Set agent name and update UI
      window.agent = data.loggedInUser.user.name;
      document.getElementById("agentName").textContent = `Hello ${agent},`;

      // Attach 'sayHello' function to a button click event
      
    },
    function (error) {
      // If failed to fetch user details
      console.error("Error: Failed to fetch loggedInUser details");
      console.error(error);
    }
  );

  document.getElementById("btnSayHello").addEventListener("fwClick", sayHello);
  document.getElementById("btnHelloGitHub").addEventListener("click", helloGitHub);
}

document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();


  function renderApp() {
    console.log("renderApp");
    var onInit = app.initialized();

    onInit.then(getClient).catch(function (error) {
      console.error("Error: Failed to initialize the app");
      console.error(error);
    });

    function getClient(_client) {
      console.log('on init')
      window.client = _client;

      client.events.on("app.activated", onAppActivate);
    }
  }
};
