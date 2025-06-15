import * as fs from 'fs';
import * as path from 'path';

export function getRandomProduct(): any {
    const filePath = path.resolve(__dirname, '../../product.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);

    if (!products.length) throw new Error('No products found in product.json');

    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
}
