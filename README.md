# Say Hello - Global App Starter

A Freshworks Platform 3.0 sample app that greets the logged-in agent in the **ticket sidebar** on Freshdesk and Freshservice using **Data Methods**, **Request Methods**, and **Interface Methods**.

## Description

In the spirit of "Hello World," Say Hello helps new developers experience the Freshworks Developer Platform end to end. The app detects which product it is running in, greets the agent by name, and creates a ticket when the agent clicks **Say Hello**.

### Core Functionality: Ticket Sidebar Greeting

1. Fetch the logged-in agent name with the **Data Method** (`loggedInUser`).
2. Detect the current product with **currentHost** so Freshdesk and Freshservice share one codebase.
3. Create a ticket in the active product via **Request Method** and confirm with **Interface Method** notifications.

## User Interfaces


| Surface          | Placement                       | Behavior                                                  |
| ---------------- | ------------------------------- | --------------------------------------------------------- |
| `app/index.html` | `support_ticket.ticket_sidebar` | Freshdesk ticket sidebar greeting and Say Hello action    |
| `app/index.html` | `service_ticket.ticket_sidebar` | Freshservice ticket sidebar greeting and Say Hello action |


## Platform 3.0 Features Used

### 1. Data Methods — Agent & Product Context

On `app.activated`, the app calls `client.data.get('loggedInUser')` for the agent name and `client.data.get('currentHost')` to determine whether it is running on Freshdesk or Freshservice via `endpoint_urls.product`.

### 2. Request Methods — Create Ticket

Two templates in `config/requests.json` create tickets through the Freshdesk and Freshservice APIs. Installation parameters supply subdomain and API key credentials for each product.

### 3. Interface Methods — User Feedback

`client.interface.trigger('showNotify')` shows success or error toasts, and an in-app Crayons label banner confirms when a ticket is created.

### 4. Crayons UI Components

The app uses Freshworks Crayons v4 design system:


| Component     | Usage                               |
| ------------- | ----------------------------------- |
| `<fw-label>`  | In-app banner after ticket creation |
| `<fw-button>` | **Say Hello** action button         |


## Project Structure

```
├── app/
│   ├── index.html          # Ticket sidebar UI (Freshdesk + Freshservice)
│   ├── scripts/
│   │   └── app.js          # Data, request, and interface orchestration
│   └── styles/
│       ├── style.css       # Sidebar layout styles
│       └── images/
│           └── wave.png    # App icon
├── config/
│   ├── iparams.json        # Freshdesk & Freshservice API credentials
│   └── requests.json       # Ticket creation request templates
├── tests/
│   └── app.test.js         # Vitest coverage for app bootstrap and click flow
├── manifest.json           # Global app configuration
├── package.json
└── vitest.config.js
```

## Prerequisites

- [Freshworks CLI (FDK)](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/basic-dev-tools/freshworks-cli/) v10.1.2 or later
- Node.js v24.x
- A Freshdesk or Freshservice trial account

Enable global apps before local development:

```bash
fdk config set global_apps.enabled true
```

## Local Development

1. Clone the repository:
  ```bash
   git clone <repo-url>
   cd say-hello
  ```
2. Install dependencies and validate:
  ```bash
   npm install
   fdk validate
  ```
3. Configure installation parameters when prompted during install:
  - Freshdesk subdomain and API key (for Freshdesk testing)
  - Freshservice subdomain and API key (for Freshservice testing)
4. Run the app locally:
  ```bash
   fdk run
  ```
5. Open your Freshdesk or Freshservice account with `?dev=true`:
  ```
   https://your-domain.freshdesk.com/a/tickets/1?dev=true
   https://your-domain.freshservice.com/a/tickets/1?dev=true
  ```

## Testing say-hello

```bash
npm test
```

Reset local storage when re-testing installation parameters:

```bash
# Stop the server and delete the SQLite file
rm .fdk/store.sqlite
fdk run
```

## Key Learnings

1. Global apps use **modules** (`support_ticket`, `service_ticket`) instead of product-specific folders — one manifest serves multiple Freshworks products.
2. Use `currentHost.endpoint_urls.product` at runtime to branch logic between Freshdesk and Freshservice without duplicating the app.

## Resources

- [Data Methods](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/front-end-apps/data-method/)
- [Request Methods](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/advanced-interfaces/request-method/)
- [Interface Methods](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/front-end-apps/interface-methods/)

