/**
 * Show a notification toast with the given type and message
 *
 * @param {String} type - type of the notification
 * @param {String} message - content to be shown in the notification
 **/
function showNotify(type, message) {
  return client.interface.trigger("showNotify", {
    type: type,
    message: message
  })
}

/**
 * Create a ticket to say hello
 */
function createTicket() {
  const ticketDetails = {
    email: 'puppycat@email.com',
    subject: `Hey ${agent} 👋, First HELLO always inspires!`,
    priority: 1,
    description: "👋, Weirdest Hello World ever 👀!!",
    status: 2
  }
  client.iparams.get("freshservice_subdomain").then(
    function (iparams) {
      client.request.post(`https://${iparams.freshservice_subdomain}.freshservice.com/api/v2/tickets`,
        {
          headers: {
            'Authorization': 'Basic <%= encode(iparam.freshservice_api_key) %>',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ticketDetails),
          method: "POST"
        }).then(() => {
      console.info('Successfully created ticket in Freshservice');
      showNotify('success', 'Successfully created a ticket to say hello');
      document.getElementById('newTicketBanner').value = `Freshservice talks in tickets, check for new ticket.`;
      }, error => {
        console.error('Error: Failed to create a ticket in Freshservice');
        console.error(error);
        showNotify('danger', 'failed to create a ticket. Try again later.');
      });
    },
    function (error) {
      console.error('Error: Failed to create a ticket');
      console.error(error);
      showNotify('danger', 'Failed to create a ticket. Try again later.');
    });
}

function onAppActivate() {
  client.data.get('loggedInUser').then(function (data) {
    window.agent = data.loggedInUser.user.name;
    document.getElementById('agentName').textContent = `Hello ${agent},`;
    document.getElementById('btnSayHello').addEventListener('fwClick', createTicket);
  }, function (error) {
    console.error('Error: Failed to fetch loggedInUser details');
    console.error(error);
  });
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(function (error) {
      console.error('Error: Failed to initialize the app');
      console.error(error);
    });

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};
