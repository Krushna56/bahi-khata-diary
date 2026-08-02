# BahiKhata Ledger

Build "Bahi-Khata" — a personal daily expense and lending tracker, styled like a traditional Indian ledger book (bahi-khata / passbook aesthetic), not a generic fintech dashboard.

CORE FEATURES

1. Add Expense

   - Fields: Date, Category (dropdown), Description, Amount (₹), Payment Mode (Cash/Card/UPI/Net Banking/Other)

   - Default categories: Food, Groceries, Transport, Rent, Utilities, Entertainment, Shopping, Health, Education, Other (user can add/rename categories)

2. Ledger / History

   - Table of all expense entries, newest first

   - Toggle between "This month" and "All history" views

   - Each row deletable

   - Simple text search/filter by description or category

3. Monthly Budgets

   - Each category has an editable monthly budget (₹)

   - Dashboard shows spent vs budget per category as a percentage, with a clear visual difference between under-budget and over-budget states

   - Totals: total budget, total spent, remaining — for the selected month

4. Money Lent (Udhaar)

   - Separate section to log cash given to someone: Date, Person name, Amount, optional Note

   - Status: Pending / Returned, toggle-able per entry

   - Running total of "amount pending" (money not yet returned)

   - Editable/deletable entries

5. Month selector

   - A single month picker controls which month's data the dashboard, budgets and totals reflect

DATA

   - Use Supabase for persistence, with user auth (email/password or magic link) so each user's ledger is private to them

   - Currency is always INR (₹), Indian number formatting (e.g. ₹12,345)

DESIGN DIRECTION

   - Aesthetic: aged ledger paper — warm cream/tan background with a subtle horizontal ruled-line texture, like notebook paper

   - Ink navy (#1E2A3A) as primary text color, brass/gold (#96733A) as the accent color for buttons, borders and highlights, muted red-ink (#97382F) for over-budget/pending states, muted green-ink (#3C6B4D) for on-budget/returned states

   - Typography: a slab serif (e.g. Roboto Slab) for headings and the app title, a clean sans (e.g. Inter) for body/labels, and a monospace font (e.g. IBM Plex Mono) for all numbers, dates and amounts so figures align neatly

   - Category budget summaries should look like circular ink rubber-stamps (double-ring border, slightly rotated, brass ink normally, red ink when over budget) rather than plain progress bars

   - Clean and uncluttered, minimal shadows, no gradients — should feel like a physical ledger book, not a SaaS dashboard

   - Fully responsive: single column on mobile, two-column layout (ledger + sidebar) on desktop

   - Visible keyboard focus states, accessible form labels

Keep the tone of all UI copy plain and direct — e.g. "Add entry", "Mark returned" — no marketing language.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bahi-khata-diary.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/83711e84-2516-4c81-a336-89b388f1e71c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
