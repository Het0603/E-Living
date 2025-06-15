import { Given } from "@wdio/cucumber-framework";
import * as fs from "fs";
import * as path from "path";
import { checkShippingAvailability } from "../../utils/shipping.helper";

// File paths
const postalPath = path.resolve(__dirname, "../../shipping_postal_codes.json");
const outputPath = path.resolve(__dirname, "../../no_shipping_postal_codes.json");

// Product config
const variantId = "40164297769002";
const productId = "6822555090986";
const grams = 25000;

// Utility to pick N random items
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

Given("I validate shipping for {string} random postal codes", async (postalCodeCount: string) => {
  const count = parseInt(postalCodeCount, 10);
  const allPostalCodes: string[] = JSON.parse(fs.readFileSync(postalPath, "utf-8"));
  const selectedPostalCodes = getRandomItems(allPostalCodes, count);

  const failed: string[] = [];

  for (const code of selectedPostalCodes) {
    const result = await checkShippingAvailability({ postalCode: code, variantId, productId, grams });

    if (!result) {
      console.log(`No shipping for ${code}`);
      failed.push(code);
    } else {
      console.log(`Shipping available for ${code}`);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(failed, null, 2), "utf-8");
  console.log(`\nExported ${failed.length} failed postal codes to: ${outputPath}`);
});

Given("I validate shipping for postal codes {string}", async (postalCodes: string) => {
  const variantId = "40164297769002";
  const productId = "6822555090986";
  const grams = 25000;

  const codes = postalCodes.split(",").map(code => code.trim());
  const failed: string[] = [];

  for (const postalCode of codes) {
    const result = await checkShippingAvailability({ postalCode, variantId, productId, grams });

    if (result) {
      console.log(`Shipping available for ${postalCode}`);
    } else {
      console.log(`No shipping for ${postalCode}`);
      failed.push(postalCode);
    }
  }

  if (failed.length > 0) {
    fs.writeFileSync(
      path.resolve(__dirname, "../../no_shipping_postal_codes_single.json"),
      JSON.stringify(failed, null, 2),
      "utf-8"
    );
    console.log(`\nExported ${failed.length} failed codes to no_shipping_postal_codes.json`);
  }
});