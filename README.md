# Inventory Management App

This project is a **Next.js** application featuring an **Inventory Management System** with full **CRUD capabilities** (Create, Read, Update, Delete). It provides a clean and efficient interface for managing product data including name, price, stock, and updated timestamps.

## Deploy in Vercel
Open [Product Management](https://product-management-chi-sable.vercel.app/) with your browser to see the result.


## Getting Started

Clone the project and install dependencies:

```bash
git clone https://(see in the repo)
cd your-repo
npm install

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

## Features

- CRUD inventory management
- Three main pages:
  - Product List (table view)
  - Create Product (form)
  - Edit Product (form)
- Table enhancements:
  - Client-side pagination
  - Sorting (Product Name, Updated Date, Price)
  - Filtering
- Form:
  - Form validation
  - Error handling using React Hook Form
- Global state using Zustand
- UI components using Shadcn UI
- Toast notifications and popup alerts
- Responsive layout
- 404 Not Found page
- Utility tools: `uuid v4`, `react-hook-form`, `lucide-react` for icons
- Prepare section to showcase application images/screenshots *(to be added)*

## Tech Stack

| Category | Tools |
|----------|--------|
| Framework | Next.js 14 |
| State Management | Zustand |
| Unit Testing | Jest |
| E2E Testing | Playwright |
| Form Handling | React Hook Form |
| Animation | React Motion |
| UI Components | Shadcn UI |
| Icons | Lucide Icons |
| UUID | uuid v4 |
| Deployment | Vercel |

## Jest Testing
- Available for utils code excludes cslx, cn othr not from me
- Folder file in the **/app/lib/__test__**
- Run with `npm test`

## E2E Testing

* You can also test UI flow for 3 application
* Go to page, Create new product and Edit product
* All code already in the **/app/test**

```bash
make sure you run project in the 2 terminal
```

### Commands

#### Run tests with UI mode

```bash
npx playwright test --headed
```

You can also run tests directly inside VSCode with the Playwright extension.

### Test Report Location

After finish the report in that folder:

```
/playwright-report
```

To open directly report:

```bash
npx playwright show-report
```

```bash
# Install deps
npm install

# Run dev server
npm run dev

# Run E2E tests
npx playwright test

# View report
npx playwright show-report
```

## Some Image of Platform
<img width="1393" height="699" alt="image" src="https://github.com/user-attachments/assets/92e06e8c-844e-44ce-888f-2ed6858dc3db" />
<img width="1401" height="712" alt="image" src="https://github.com/user-attachments/assets/c8c0cc3a-0ae3-4c9c-8986-d9c2f2651599" />
<img width="1403" height="568" alt="image" src="https://github.com/user-attachments/assets/40e65175-0aa4-45ee-9112-155f12eb9535" />




