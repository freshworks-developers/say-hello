# Say Hello app

Let’s Say Hello👋 to Freshdesk.
This app lets you say `Hello` to Freshdesk and responds you with a ticket.

## Functionality

Upon clicking the button `Say Hello👋` , a ticket is created with a successful notification.

![ App flow Image](screenshots/app-flow-freshdesk.png "Text to show on mouseover")

### Steps to run app

1. Follow the steps in the documentation [here](https://developer.freshdesk.com/v2/docs/quick-start) to get started with the platform.
2. Execute the command, `fdk run` to run the app.

### Platform features used

1. [Data Methods](https://developer.freshdesk.com/v2/docs/data-methods/) - to fetch the logged in user.
2. [Request Methods](https://developer.freshdesk.com/v2/docs/request-method/) - to make API request for ticket creation.
3. [Interface Methods](https://developer.freshdesk.com/v2/docs/interface-methods/) - to show notification to the user.

### Freshdesk APIs used

1. [Create Ticket API](https://developer.freshdesk.com/api/#create_ticket) - to create a ticket on Freshdesk with Request Method.
