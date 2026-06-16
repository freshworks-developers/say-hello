# Use Cases — Say Hello Global App

## Overview

**Say Hello** is the canonical onboarding sample for Freshworks Platform 3.0 global apps. It demonstrates how one codebase can greet agents and create tickets on both **Freshdesk** and **Freshservice** from the ticket sidebar.

---

## Use Case Scenarios

### 1. First-time developer onboarding

**Scenario:** A developer new to the Freshworks platform wants a minimal working app before exploring advanced samples.

**Use Case:** Clone the repo, run `fdk run`, open a ticket with `?dev=true`, and click **Say Hello** to see data, request, and interface methods work together.

### 2. Dual-product validation from one manifest

**Scenario:** A partner builds an integration that must work on both Freshdesk and Freshservice without maintaining two repositories.

**Use Case:** The app declares `support_ticket` and `service_ticket` modules in `manifest.json` and uses `currentHost` at runtime to pick the correct API template.

### 3. Agent greeting in the ticket sidebar

**Scenario:** Agents open tickets throughout the day and benefit from contextual UI in the sidebar.

**Use Case:** On activation, the app reads `loggedInUser.contact.name` and displays a personalized greeting before the agent takes action.
