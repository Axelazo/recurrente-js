/* import {recurrente} from '../src'; // Adjust the import based on your project structure
import {ProductSubscription, CreateProductRequest} from '../src/types/globals';

// Utility function to add random delays between actions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Example product data for testing
const generateProductData = (name: string): CreateProductRequest => ({
  name,
  pricesAttributes: [
    {
      currency: 'GTQ',
      chargeType: 'one_time',
      amountInCents: 1000,
    },
  ],
  successUrl: 'https://www.example.com/success',
  cancelUrl: 'https://www.example.com/cancel',
  phoneRequirement: 'none', // Adding the missing fields
  addressRequirement: 'none', // Adding the missing fields
  billingInfoRequirement: 'none', // Adding the missing fields
});

// Example subscription data for testing
const generateSubscriptionData = (
  productName: string
): ProductSubscription => ({
  product: {
    name: productName,
    pricesAttributes: [
      {
        currency: 'GTQ',
        chargeType: 'recurring',
        amountInCents: 500,
        billingIntervalCount: 1,
        billingInterval: 'month',
      },
    ],
    successUrl: 'https://www.example.com/success',
    cancelUrl: 'https://www.example.com/cancel',
  },
});

describe('Recurrente API Test Suite', () => {
  const createdProducts: string[] = [];
  const createdSubscriptions: string[] = [];

  it('should create multiple products and track their IDs', async () => {
    for (let i = 0; i < 3; i++) {
      const productData = generateProductData(`Product ${i}`);
      const response = await recurrente.createProduct(productData);
      expect(response).toHaveProperty('id');
      createdProducts.push(response.id);
      console.log(`Created Product ID: ${response.id}`);
    }
  }, 15000); // Set a custom timeout of 15 seconds

  it('should create multiple subscriptions and track their IDs', async () => {
    for (let i = 0; i < 2; i++) {
      const subscriptionData = generateSubscriptionData(
        `Subscription Product ${i}`
      );
      const response = await recurrente.createSubscription(subscriptionData);
      expect(response).toHaveProperty('id');
      createdSubscriptions.push(response.id);
      console.log(`Created Subscription ID: ${response.id}`);
    }
  }, 15000); // Set a custom timeout of 15 seconds

  it('should retrieve all products', async () => {
    const response = await recurrente.getAllProducts();
    expect(Array.isArray(response)).toBe(true);
    response.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      console.log(`Retrieved Product ID: ${product.id}`);
    });
  }, 10000); // Set a custom timeout of 10 seconds

  it('should retrieve a specific product by ID', async () => {
    const productId = createdProducts[0];
    const response = await recurrente.getProduct(productId);
    expect(response).toHaveProperty('id', productId);
    console.log(`Retrieved Specific Product ID: ${response.id}`);
  }, 10000); // Set a custom timeout of 10 seconds

  it('should cancel subscriptions and delete products after random intervals', async () => {
    for (const subscriptionId of createdSubscriptions) {
      await delay(Math.random() * 2000 + 1000); // Reduce random delay to between 1-3 seconds
      const cancelResponse =
        await recurrente.cancelSubscription(subscriptionId);
      expect(cancelResponse).toHaveProperty('message');
      console.log(`Cancelled Subscription ID: ${subscriptionId}`);

      await delay(1000); // Fixed 1-second delay before deleting
      const deleteResponse = await recurrente.deleteProduct(subscriptionId);
      expect(deleteResponse).toHaveProperty('message');
      console.log(`Deleted Product/Subscription ID: ${subscriptionId}`);
    }

    for (const productId of createdProducts) {
      await delay(Math.random() * 2000 + 1000); // Reduce random delay to between 1-3 seconds
      const deleteResponse = await recurrente.deleteProduct(productId);
      expect(deleteResponse).toHaveProperty('message');
      console.log(`Deleted Product ID: ${productId}`);
    }
  }, 30000); // Set a custom timeout of 30 seconds for long-running tests
});
 */

import {recurrente} from '../src'; // Adjust the import based on your project structure
import {
  ProductSubscription,
  CreateProductRequest,
  UpdateProductRequest,
} from '../src/types/globals';

// Example product data for testing
const generateProductData = (name: string): CreateProductRequest => ({
  name,
  pricesAttributes: [
    {
      currency: 'GTQ',
      chargeType: 'one_time',
      amountInCents: 1000,
    },
  ],
  successUrl: 'https://www.example.com/success',
  cancelUrl: 'https://www.example.com/cancel',
  phoneRequirement: 'none',
  addressRequirement: 'none',
  billingInfoRequirement: 'none',
});

// Example subscription data for testing
const generateSubscriptionData = (
  productName: string
): ProductSubscription => ({
  product: {
    name: productName,
    pricesAttributes: [
      {
        currency: 'GTQ',
        chargeType: 'recurring',
        amountInCents: 500,
        billingIntervalCount: 1,
        billingInterval: 'month',
      },
    ],
    successUrl: 'https://www.example.com/success',
    cancelUrl: 'https://www.example.com/cancel',
  },
});

describe('Recurrente API Test Suite', () => {
  const createdProducts: string[] = [];
  const createdSubscriptions: string[] = [];
  let productToUpdate = ''; // Store the product to update
  let priceIdToUpdate = ''; // Store the price ID to update

  // Create products before running tests
  beforeAll(async () => {
    for (let i = 0; i < 3; i++) {
      const productData = generateProductData(`Product ${i}`);
      const response = await recurrente.createProduct(productData);
      expect(response).toHaveProperty('id');
      createdProducts.push(response.id);
      console.log(`Created Product ID: ${response.id}`);
    }
    productToUpdate = createdProducts[0]; // Set the first product for updating later
  });

  // Clean up after all tests have run
  afterAll(async () => {
    // Cancel and delete subscriptions
    for (const subscriptionId of createdSubscriptions) {
      await recurrente.cancelSubscription(subscriptionId);
      console.log(`Cancelled Subscription ID: ${subscriptionId}`);

      // Delete the subscription if the API supports it
      // If not, skip this step
      // await recurrente.deleteSubscription(subscriptionId);
      // console.log(`Deleted Subscription ID: ${subscriptionId}`);
    }

    // Delete products
    for (const productId of createdProducts) {
      await recurrente.deleteProduct(productId);
      console.log(`Deleted Product ID: ${productId}`);
    }
  });

  it('should validate product properties', async () => {
    const response = await recurrente.getAllProducts();
    response.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('prices');
      expect(product.prices[0]).toHaveProperty('amountInCents');
      expect(product.prices[0]).toHaveProperty('chargeType', 'one_time');
      expect(product.prices[0]).toHaveProperty('currency', 'GTQ');
      console.log(`Validated Product ID: ${product.id}`);
    });
  }, 10000);

  it('should update the product price and name, and validate', async () => {
    // First, retrieve the product to get the price ID
    const productResponse = await recurrente.getProduct(productToUpdate);
    priceIdToUpdate = productResponse.prices[0].id; // Store the price ID

    const updatedName = 'Updated Product Name';

    const updateData: UpdateProductRequest = {
      name: updatedName,
      pricesAttributes: [
        {
          id: priceIdToUpdate, // Use the price ID
          amountInCents: 2000,
        },
      ],
    };

    const updateResponse = await recurrente.updateProduct(
      productToUpdate,
      updateData
    );
    expect(updateResponse).toHaveProperty('id', productToUpdate);
    console.log(`Updated Product ID: ${productToUpdate}`);

    const updatedProduct = await recurrente.getProduct(productToUpdate);
    expect(updatedProduct).toHaveProperty('prices');
    expect(updatedProduct.prices[0].amountInCents).toBe(2000);
    expect(updatedProduct.name).toBe(updatedName);
    console.log(
      `Validated Updated Product Price: ${updatedProduct.prices[0].amountInCents}`
    );
    console.log(`Validated Updated Product Name: ${updatedProduct.name}`);
  }, 15000);

  it('should attempt to delete the product price, and validate that it still exists', async () => {
    const deletePriceData: UpdateProductRequest = {
      pricesAttributes: [
        {
          id: priceIdToUpdate, // Use the correct price ID
          _destroy: true,
        },
      ],
    };

    const deleteResponse = await recurrente.updateProduct(
      productToUpdate,
      deletePriceData
    );
    expect(deleteResponse).toHaveProperty('id', productToUpdate);
    console.log(
      `Attempted to delete price from Product ID: ${productToUpdate}`
    );

    const productAfterDelete = await recurrente.getProduct(productToUpdate);
    expect(productAfterDelete.prices.length).toBe(1); // Price still exists
    console.log(
      `Validated Price still exists for Product ID: ${productToUpdate}`
    );
  }, 15000);

  it('should create multiple subscriptions and track their IDs', async () => {
    for (let i = 0; i < 2; i++) {
      const subscriptionData = generateSubscriptionData(
        `Subscription Product ${i}`
      );
      const response = await recurrente.createSubscription(subscriptionData);
      expect(response).toHaveProperty('id');
      createdSubscriptions.push(response.id);
      console.log(`Created Subscription ID: ${response.id}`);
    }
  }, 15000);

  it('should validate subscription status properties', async () => {
    console.log(createdSubscriptions);
    for (const subscriptionId of createdSubscriptions) {
      const response = await recurrente.getSubscription(subscriptionId);

      console.log(`Update subscription response: ${response}`);

      // Validate core subscription status properties
      expect(response).toHaveProperty('id', subscriptionId);
      expect(response).toHaveProperty('status');
      expect(['active', 'inactive', 'pending', 'canceled']).toContain(
        response.status
      );

      // Validate date fields are valid ISO strings
      expect(response).toHaveProperty('createdAt');
      expect(new Date(response.createdAt).toISOString()).toBe(
        response.createdAt
      );

      expect(response).toHaveProperty('updatedAt');
      expect(new Date(response.updatedAt).toISOString()).toBe(
        response.updatedAt
      );

      // Validate subscriber information
      expect(response).toHaveProperty('subscriber');
      expect(response.subscriber).toHaveProperty('id');
      expect(response.subscriber).toHaveProperty('email');
      expect(response.subscriber).toHaveProperty('fullName');

      // Validate the associated product
      expect(response).toHaveProperty('product');
      expect(response.product).toHaveProperty('id');

      console.log(`Validated Subscription Status for ID: ${response.id}`);
    }
  }, 10000);
  // No longer need to cancel subscriptions and delete products here since it's handled in afterAll
});
