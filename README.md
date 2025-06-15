# Eliving POC

## Project Overview
This POC demonstrates an automated end-to-end test suite for the Lifely e-commerce website. It uses WebdriverIO with Cucumber to validate product details, search functionality, and checkout flow.

## Tech Stack
- **Framework:** WebdriverIO
- **Testing Framework:** Cucumber
- **Language:** TypeScript
- **Package Manager:** npm
- **Reporting:** Allure, Cucumber JSON Reporter

## Project Structure
- **features/** – Contains Cucumber feature files (e.g., fullWorkflow.feature) and step definitions.
- **utils/** – Helper utilities for fetching products and selecting random products.
- **config/** – Configuration files (if any).
- **reports/** – Generated Cucumber JSON reports.
- **allure-results/** – Raw Allure report data.
- **allure-report/** – Generated Allure HTML reports.
- **wdio.conf.ts** – WebdriverIO configuration file.
- **package.json** – Project metadata and dependencies.
- **tsconfig.json** – TypeScript configuration.

## Features Implemented
- **Product Validation:** Fetches products from the Lifely API, selects a random product, and validates its title and pricing on the product detail page.
- **Search Functionality:** Searches for a product and verifies the search results.
- **Checkout Flow:** Adds the product to the cart and proceeds to checkout, filling in shipping details.
- **Shipping Validation:** Validates shipping availability for specific postal codes.

## How it Works
1. **Fetch Products:** The test fetches all products from the Lifely API and stores them in a JSON file.
2. **Select Random Product:** A random product is selected for testing.
3. **Visit Homepage:** The test navigates to the Lifely homepage.
4. **Search for Product:** The test searches for the selected product.
5. **Validate Product Details:** The test verifies the product title and pricing on the product detail page.
6. **Validate Button Status:** The test checks the status of the "Add to Cart" button for all variants.
7. **Add to Cart & Checkout:** The test adds the product to the cart and proceeds to checkout, filling in shipping details.
8. **Validate Shipping:** The test validates shipping availability for specific postal codes.

## Setup & Installation
1. Clone the repository.
2. Install dependencies:
```bash
npm install
```

## Running the Tests
Execute the tests using the following command:
```bash
npm run wdio
```

## Reports
- **Allure Reports:** Generate and view Allure reports using:
```bash
npm run allure:report
```
- **Cucumber Reports:** JSON reports are generated in the `reports/cucumberjs-json` directory.

## Customization
- Add new feature files in the `features` directory.
- Implement step definitions in `features/step-definitions/steps.ts` and `features/step-definitions/shipping.steps.ts`.
- Modify `wdio.conf.ts` to adjust test configurations.
