import { Given, When, Then } from '@wdio/cucumber-framework';
import * as assert from 'assert';
import { fetchAndSaveAllProducts } from '../../utils/getProducts.helper';
import { getRandomProduct } from '../../utils/randomProduct.helper';

let productData: any;
let selectedProduct: any;

Given('I fetch and store all products from Lifely', async () => {
    await fetchAndSaveAllProducts();
});

Then('I pick a random product to work with', () => {
    selectedProduct = getRandomProduct();
    productData = selectedProduct;
    console.log(`Selected product: ${selectedProduct.title}`);
});

// Given('I fetch all products from the API', async () => {
//     const response = await axios.get('https://lifelystore.myshopify.com/products.json');
//     const products = response.data.products;
//     const inStockProducts = products.filter((p: any) => p.variants.some((v: any) => v.available));
//     selectedProduct = inStockProducts[Math.floor(Math.random() * inStockProducts.length)];
//     productData = selectedProduct;
// });

When('I visit the homepage', async () => {
    await browser.url('https://lifely.com.au/');
});

When('I pick a random product and search for it', async () => {
    const searchInput = await $('//input[@id="Search-In-Modal-1"]');
    await searchInput.setValue(productData.title);
    await browser.pause(4000);
});

When('I click on the product in search results', async () => {
    const productLink = await $(`//a[text()="${productData.title}"]/ancestor::article`);
    await productLink.waitForDisplayed();
    await productLink.click();
});

Then('I should see correct product title and pricing', async () => {
    const titleEl = await $('//h1[@class="product__title"]');
    const displayedTitle = await titleEl.getText();
    assert.strictEqual(displayedTitle.trim(), productData.title.trim(), 'Product title mismatch');

    const variant = productData.variants[0];
    const finalPrice = await $('//h5[@class="originalPrice"]').getText(); // adjust selector
    const comparePrice = await $('//h5[@class="price-compare-new"]').getText(); // adjust selector 

    const finalPriceNormalized = finalPrice.replace(/[^\d.]/g, '');
    const comparePriceNormalized = comparePrice.replace(/[^\d.]/g, '');

    if (variant.price != null) {
        assert.ok(
            finalPriceNormalized.includes(variant.price),
            'Final price mismatch: expected ' + variant.price + ', got ' + finalPriceNormalized
        );
    }

    if (variant.compare_at_price != null) {
        assert.ok(
            comparePriceNormalized.includes(variant.compare_at_price),
            'Compare price mismatch: expected ' + variant.compare_at_price + ', got ' + comparePriceNormalized
        );
    }
});

Then('I validate the button status for all variants', async () => {
    const variants = productData.variants;

    // Handle no variant case (Default Title)
    if (variants.length === 1 && variants[0].option1 === 'Default Title') {
        const ctaBtn = await $('//button[@id="product_detail_custom_add_to_cart"]//span');
        const text = await ctaBtn.getText();
        const isAvailable = variants[0].available;

        if (isAvailable) {
            assert.ok(
                text.toLowerCase().includes('add to cart') || ctaBtn.isEnabled(),
                'Available product should have enabled CTA'
            );
        } else {
            assert.ok(
                text.toLowerCase().includes('pre-order') || !ctaBtn.isEnabled(),
                'Unavailable product should have disabled CTA'
            );
        }
        return;
    }

    // Handle multi-variant case
    for (let variant of variants) {
        const variantBtn = await $(`//label[normalize-space(text())="${variant.option1}"]`);
        await variantBtn.click();

        const ctaBtn = await $('//button[@id="product_detail_custom_add_to_cart"]//span');
        const text = await ctaBtn.getText();
        const isAvailable = variant.available;

        if (isAvailable) {
            assert.ok(
                text.toLowerCase().includes('add to cart') || ctaBtn.isEnabled(),
                `Variant "${variant.option1}" is available but CTA is not enabled`
            );
        } else {
            assert.ok(
                text.toLowerCase().includes('pre-order') || !ctaBtn.isEnabled(),
                `Variant "${variant.option1}" is unavailable but CTA is not disabled`
            );
        }
    }
});

Then('I add the product to cart and proceed to checkout', async () => {
    // Click the CTA button
    const ctaBtn = await $('//button[@id="product_detail_custom_add_to_cart"]');
    await ctaBtn.click();

    // Wait for mini cart to appear
    const miniCart = await $('//div[@id="corner-cowi-open-primary-card"]');
    await miniCart.waitForDisplayed({ timeout: 5000 });
    await browser.pause(3000); // Allow time for mini cart to update

    // Validate product title in mini cart
    const miniCartTitle = await $(`//div[@id="corner-cowi-cart-item-list-item-info-title-wrapper-0"]//p[text()="${productData.title}"]`);
    assert.ok(await miniCartTitle.isDisplayed(), 'Mini cart product title does not match');

    // Validate price
    // const variant = productData.variants[0];
    // const miniCartPrice = await $('//div[contains(@class,"cart-item")]//span[contains(text(), "$")]');
    // const miniPriceText = await miniCartPrice.getText();
    // assert.ok(miniPriceText.includes(variant.price), 'Mini cart price mismatch');

    // Click on Secure Checkout
    const checkoutBtn = await $('//button[@aria-label="checkout-call-to-action-button"]');
    await checkoutBtn.click();
});

Then('I fill in the shipping details and calculate shipping', async () => {
    // Wait for checkout page to load
    await browser.pause(5000); // adjust based on network

    // Fill contact email
    const emailInput = await $('//input[@id="email"]');
    await emailInput.setValue('hetlu0306@gmail.com');

    // Select country (should be defaulted to Australia)
    // const countrySelect = await $('select#checkout_shipping_address_country');
    // await countrySelect.selectByVisibleText('Australia');

    // Fill shipping address
    await $('//input[@name="firstName" and @placeholder]').setValue('John');
    await $('//input[@name="lastName" and @placeholder]').setValue('Doe');
    await $('//input[@name="address1" and @placeholder]').setValue('123 Test Street');
    await browser.keys('Down'); // select the first option in the dropdown
    await browser.keys('Enter'); // simulate Enter key to trigger address suggestions if needed
    await $('//input[@name="city" and @placeholder]').setValue('Canberra');
    // await $('#state').selectByAttribute('value', 'ACT');
    // await $('//select[@name="zone"]').click();
    // await browser.keys('Enter'); // confirm selection
    await $('//input[@name="postalCode" and @placeholder]').setValue('2601');
    await $('//input[@name="phone" and @placeholder]').setValue('0400000000');

    // // Click Calculate Shipping
    // const calcShippingBtn = await $('//span[contains(text(),"Calculate shipping")]');
    // await calcShippingBtn.click();

    await browser.pause(3000); // allow time for calculation if needed
});
