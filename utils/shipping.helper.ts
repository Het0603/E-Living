import axios from "axios";
import * as fs from "fs";
import * as path from "path";

interface RateCheckParams {
  postalCode: string;
  variantId: string;
  productId: string;
  grams: number;
}

export async function checkShippingAvailability({ postalCode, variantId, productId, grams }: RateCheckParams): Promise<boolean> {
  const payload = new URLSearchParams({
    "rate[destination][postal_code]": postalCode,
    "rate[destination][province]": "WA",
    "rate[destination][city]": "TestCity",
    "rate[destination][country]": "AU",
    "rate[origin][address]": "2/9 Leakes Rd",
    "rate[origin][postal_code]": "3026",
    "rate[origin][province]": "VIC",
    "rate[origin][country]": "AU",
    "rate[items][0][product_id]": productId,
    "rate[items][0][variant_id]": variantId,
    "rate[items][0][quantity]": "1",
    "rate[items][0][grams]": grams.toString(),
    "rate[items][0][vendor]": "lifelystore.myshopify.com",
    "shop": "lifelystore.myshopify.com"
  });

  try {
    const response = await axios.post("https://sbz.cirkleinc.com/front-widget", payload.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://lifely.com.au"
      }
    });

    return Array.isArray(response.data.rates) && response.data.rates.length > 0;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error checking ${postalCode}:`, error.message);
    } else {
      console.error(`Error checking ${postalCode}:`, error);
    }
    return false;
  }
}
