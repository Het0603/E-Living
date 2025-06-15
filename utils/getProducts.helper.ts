import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export async function fetchAndSaveAllProducts(): Promise<void> {
    const allProducts: any[] = [];
    let page = 1;
    const limit = 250;

    while (true) {
        const url = `https://lifely.com.au/products.json?limit=${limit}&page=${page}`;
        const response = await axios.get(url);
        const products = response.data.products;

        if (!products || products.length === 0) break;

        allProducts.push(...products);
        page++;
        console.log(`Fetched page ${page - 1} with ${products.length} products`);
    }

    const filePath = path.resolve(__dirname, '../../product.json');
    fs.writeFileSync(filePath, JSON.stringify(allProducts, null, 2), 'utf-8');
    console.log(`Saved ${allProducts.length} products to product.json`);
}
