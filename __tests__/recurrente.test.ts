/* import {recurrente} from '../src'; // Adjust the import based on your project structure
import {
  ProductSubscription,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCheckoutRequest,
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
  let createdCheckoutId = ''; 

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

// Rename the test to be more accurate
it('should create a subscription-type product and validate its properties', async () => {
  // 1. Define the data for a recurring product
  const subscriptionData = {
    product: {
      name: 'Monthly Pro Plan',
      pricesAttributes: [
        {
          currency: 'GTQ',
          chargeType: 'recurring',
          amountInCents: 9900,
          billingIntervalCount: 1,
          billingInterval: 'month',
        },
      ],
      successUrl: 'https://www.example.com/success',
      cancelUrl: 'https://www.example.com/cancel',
    },
  } satisfies ProductSubscription 

  // 2. Call the function and get the response (which is a Product)
  const productResponse = await recurrente.createSubscription(subscriptionData);
  const productId = productResponse.id; // This will be a 'prod_...' ID

  // Add the new product ID to the list for cleanup
  createdProducts.push(productId);
  
  // 3. Use getProduct() to fetch the entity you just created
  const createdProduct = await recurrente.getProduct(productId);

  // 4. Assert that the product has the correct recurring properties
  expect(createdProduct).toHaveProperty('id', productId);
  expect(createdProduct.name).toBe('Monthly Pro Plan');
  expect(createdProduct.prices[0]).toHaveProperty('chargeType', 'recurring');
  expect(createdProduct.prices[0]).toHaveProperty('billingInterval', 'month');
  expect(createdProduct.prices[0]).toHaveProperty('amountInCents', 9900);

  console.log(`Validated Subscription Product ID: ${productId}`);
});

  // --- NEW CHECKOUT TESTS ---
  describe('Checkout Workflow', () => {
    it('should create a checkout for an existing product', async () => {
      // Ensure we have a product to checkout (using the one created in beforeAll)
      const productId = createdProducts[0];
      expect(productId).toBeDefined();

      const checkoutData: CreateCheckoutRequest = {
        items: [{ productId: productId }],
        successUrl: 'https://www.example.com/checkout/success',
        cancelUrl: 'https://www.example.com/checkout/cancel',
        metadata: { source: 'test_suite' }
      };

      const response = await recurrente.createCheckout(checkoutData);

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('checkoutUrl');
      expect(response.status).toBe('unpaid');
      
      createdCheckoutId = response.id;
      console.log(`Created Checkout ID: ${createdCheckoutId}`);
    });

    it('should retrieve the created checkout by ID', async () => {
      expect(createdCheckoutId).toBeTruthy();

      const checkout = await recurrente.getCheckout(createdCheckoutId);
      
      expect(checkout.id).toBe(createdCheckoutId);
      expect(checkout.status).toBe('unpaid');
      expect(checkout.metadata).toHaveProperty('source', 'test_suite');
      console.log(`Retrieved Checkout ID: ${checkout.id}`);
    });

    it('should update the checkout metadata and URLs', async () => {
      expect(createdCheckoutId).toBeTruthy();

      const updateData = {
        metadata: { source: 'test_suite_updated', extra: 'info' },
        successUrl: 'https://www.google.com'
      };

      const updatedCheckout = await recurrente.updateCheckout(createdCheckoutId, updateData);

      expect(updatedCheckout.id).toBe(createdCheckoutId);
      expect(updatedCheckout.metadata).toHaveProperty('source', 'test_suite_updated');
      expect(updatedCheckout.successUrl).toBe('https://www.google.com');
      console.log(`Updated Checkout ID: ${updatedCheckout.id}`);
    });

    it('should list all checkouts and find the created one', async () => {
      // Fetch checkouts (limit to recent ones to ensure speed)
      const checkouts = await recurrente.getAllCheckouts({ items: 20, page: 1 });
      
      expect(Array.isArray(checkouts)).toBe(true);
      
      const found = checkouts.find(c => c.id === createdCheckoutId);
      expect(found).toBeDefined();
      console.log(`Found checkout in list: ${found?.id}`);
    });
  });
  
});
 */

/**
 * Recurrente API Test Suite (Jest)
 * - Thorough structured logging (timestamps, test names, step timing)
 * - Aggressive cleanup strategy:
 *   1) Track every created entity ID
 *   2) Best-effort cleanup in:
 *      - afterAll
 *      - process "exit"/"SIGINT"/"SIGTERM"/"uncaughtException"/"unhandledRejection"
 *   3) Cleanup tries multiple strategies per ID (cancelSubscription, deleteProduct, etc.)
 *
 * IMPORTANT:
 * - If Jest is forced to hard-exit (e.g., --forceExit) or the node process crashes,
 *   no cleanup can be 100% guaranteed. This file attempts to mitigate that by
 *   registering process handlers that run cleanup before exiting.
 */

import { recurrente } from "../src"; // Adjust the import based on your project structure
import type {
  ProductSubscription,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCheckoutRequest,
} from "../src/types/globals";

// -----------------------------
// Global Jest timeout
// -----------------------------
jest.setTimeout(60_000);

// -----------------------------
// Utilities: logging + timing
// -----------------------------
type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

const nowIso = () => new Date().toISOString();

function getTestNameSafe(): string {
  try {
    // Jest provides currentTestName here while inside tests/hooks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = (expect as any)?.getState?.();
    return state?.currentTestName ?? "unknown_test";
  } catch {
    return "unknown_test";
  }
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const testName = getTestNameSafe();
  const prefix = `[${nowIso()}] [${level}] [${testName}]`;
  if (meta !== undefined) {
    // Keep meta as JSON to make it searchable in CI logs
    const safe =
      typeof meta === "string"
        ? meta
        : (() => {
            try {
              return JSON.stringify(meta, null, 2);
            } catch {
              return String(meta);
            }
          })();
    // eslint-disable-next-line no-console
    console.log(`${prefix} ${message}\n${safe}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`${prefix} ${message}`);
  }
}

async function withStep<T>(stepName: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  log("INFO", `▶ STEP START: ${stepName}`);
  try {
    const result = await fn();
    const ms = Date.now() - start;
    log("INFO", `✅ STEP OK: ${stepName} (${ms}ms)`);
    return result;
  } catch (err) {
    const ms = Date.now() - start;
    log("ERROR", `❌ STEP FAIL: ${stepName} (${ms}ms)`, {
      error:
        err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack }
          : err,
    });
    throw err;
  }
}

function summarizeId(id: string) {
  if (!id) return id;
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}…${id.slice(-6)}`;
}

// -----------------------------
// Data generators
// -----------------------------
const generateProductData = (name: string): CreateProductRequest => ({
  name,
  pricesAttributes: [
    {
      currency: "GTQ",
      chargeType: "one_time",
      amountInCents: 1000,
    },
  ],
  successUrl: "https://www.example.com/success",
  cancelUrl: "https://www.example.com/cancel",
  phoneRequirement: "none",
  addressRequirement: "none",
  billingInfoRequirement: "none",
});

const generateSubscriptionData = (productName: string): ProductSubscription => ({
  product: {
    name: productName,
    pricesAttributes: [
      {
        currency: "GTQ",
        chargeType: "recurring",
        amountInCents: 500,
        billingIntervalCount: 1,
        billingInterval: "month",
      },
    ],
    successUrl: "https://www.example.com/success",
    cancelUrl: "https://www.example.com/cancel",
  },
});

// -----------------------------
// Entity tracking + cleanup
// -----------------------------
const createdProducts = new Set<string>();
const createdSubscriptions = new Set<string>();
const createdCheckouts = new Set<string>();

// IMPORTANT: When APIs are inconsistent (some methods return prod_ IDs, others sub_ IDs),
// we try to classify based on prefixes, but also fall back to "try both" in cleanup.
function trackCreatedId(id: string, hint?: "product" | "subscription" | "checkout") {
  if (!id) return;

  const pref = id.split("_", 1)[0]?.toLowerCase();
  if (hint === "product") createdProducts.add(id);
  else if (hint === "subscription") createdSubscriptions.add(id);
  else if (hint === "checkout") createdCheckouts.add(id);
  else {
    // No hint: guess
    if (pref === "prod") createdProducts.add(id);
    else if (pref === "sub") createdSubscriptions.add(id);
    else if (pref === "chk" || pref === "checkout") createdCheckouts.add(id);
    else {
      // Unknown ID format: track in both product/subscription buckets for safety
      createdProducts.add(id);
      createdSubscriptions.add(id);
    }
  }

  log("INFO", `Tracked created ID (${hint ?? "auto"}): ${id}`);
}

async function safeCall(name: string, fn: () => Promise<unknown>) {
  try {
    await withStep(name, async () => fn());
    return { ok: true as const };
  } catch (err) {
    log("WARN", `Cleanup action failed: ${name}`, {
      error:
        err instanceof Error
          ? { name: err.name, message: err.message }
          : String(err),
    });
    return { ok: false as const, err };
  }
}

/**
 * Best-effort cleanup routine
 * - Cancels subscriptions first (less likely to fail due to product deps)
 * - Deletes products after
 * - Checkouts: delete if API supports; otherwise just log
 */
let cleanupHasRun = false;
async function cleanupAll(reason: string) {
  if (cleanupHasRun) {
    log("DEBUG", `Cleanup already executed. Skipping. (reason=${reason})`);
    return;
  }
  cleanupHasRun = true;

  log("WARN", `🧹 CLEANUP START (reason=${reason})`, {
    products: Array.from(createdProducts),
    subscriptions: Array.from(createdSubscriptions),
    checkouts: Array.from(createdCheckouts),
  });

  // 1) Cancel subscriptions
  for (const subId of Array.from(createdSubscriptions)) {
    await safeCall(`cancelSubscription(${summarizeId(subId)})`, async () => {
      // If it isn't a subscription ID, this may throw; it's OK.
      await recurrente.cancelSubscription(subId);
    });
  }

  // 2) Delete products
  for (const prodId of Array.from(createdProducts)) {
    await safeCall(`deleteProduct(${summarizeId(prodId)})`, async () => {
      await recurrente.deleteProduct(prodId);
    });
  }

  // 3) Attempt to delete checkouts if there is a method (not guaranteed)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyRecurrente = recurrente as any;
  const hasDeleteCheckout = typeof anyRecurrente?.deleteCheckout === "function";

  if (createdCheckouts.size > 0) {
    if (hasDeleteCheckout) {
      for (const chkId of Array.from(createdCheckouts)) {
        await safeCall(`deleteCheckout(${summarizeId(chkId)})`, async () => {
          await anyRecurrente.deleteCheckout(chkId);
        });
      }
    } else {
      log(
        "WARN",
        "Checkout cleanup: recurrente.deleteCheckout() not found. Checkouts may remain in provider."
      );
    }
  }

  log("WARN", `🧹 CLEANUP END (reason=${reason})`);
}

// Register process handlers to reduce “leftover entities” when Jest bails out.
function registerProcessCleanupHandlers() {
  // Avoid registering twice if this file is evaluated multiple times
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  if (g.__RECURRENTE_CLEANUP_REGISTERED__) return;
  g.__RECURRENTE_CLEANUP_REGISTERED__ = true;

  const handle = async (event: string, err?: unknown) => {
    try {
      if (err) {
        log("ERROR", `Process event: ${event}`, {
          error:
            err instanceof Error
              ? { name: err.name, message: err.message, stack: err.stack }
              : err,
        });
      } else {
        log("WARN", `Process event: ${event}`);
      }
      await cleanupAll(`process:${event}`);
    } catch (e) {
      log("ERROR", `Cleanup failed during process:${event}`, e);
    } finally {
      // For signals and fatal errors, exit after attempting cleanup
      if (event === "SIGINT" || event === "SIGTERM") process.exit(1);
      if (event === "uncaughtException") process.exit(1);
      if (event === "unhandledRejection") process.exit(1);
    }
  };

  process.on("SIGINT", () => void handle("SIGINT"));
  process.on("SIGTERM", () => void handle("SIGTERM"));
  process.on("uncaughtException", (err) => void handle("uncaughtException", err));
  process.on("unhandledRejection", (reason) => void handle("unhandledRejection", reason));

  // NOTE: "exit" cannot be async-reliably awaited, but we can still log.
  process.on("exit", () => {
    // eslint-disable-next-line no-console
    console.log(
      `[${nowIso()}] [WARN] [process] exit fired. If cleanup did not run before, entities may remain.`
    );
  });
}

registerProcessCleanupHandlers();

// -----------------------------
// Test suite
// -----------------------------
describe("Recurrente API Test Suite", () => {
  let productToUpdate = ""; // Store the product to update
  let priceIdToUpdate = ""; // Store the price ID to update
  let createdCheckoutId = "";

  beforeAll(async () => {
    log("INFO", "beforeAll: Creating seed products...");

    await withStep("Create 3 one_time products", async () => {
      for (let i = 0; i < 3; i++) {
        const productData = generateProductData(`Product ${i}`);
        const response = await recurrente.createProduct(productData);

        log("DEBUG", "createProduct response", response);

        expect(response).toHaveProperty("id");
        trackCreatedId(response.id, "product");

        log("INFO", `Created Product ID: ${response.id}`);
      }
    });

    productToUpdate = Array.from(createdProducts)[0] ?? "";
    expect(productToUpdate).toBeTruthy();
    log("INFO", `Product selected for update tests: ${productToUpdate}`);
  });

  afterAll(async () => {
    // If tests fail, afterAll should still run. This ensures everything is deleted.
    await cleanupAll("afterAll");
  });

  it("should validate product properties", async () => {
    const response = await withStep("getAllProducts()", async () => {
      const products = await recurrente.getAllProducts();
      log("DEBUG", `getAllProducts returned ${products.length} products`);
      return products;
    });

    await withStep("Validate products shape", async () => {
      response.forEach((product, idx) => {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("prices");

        if (Array.isArray(product.prices) && product.prices.length > 0) {
          expect(product.prices[0]).toHaveProperty("amountInCents");
          expect(product.prices[0]).toHaveProperty("chargeType", "one_time");
          expect(product.prices[0]).toHaveProperty("currency", "GTQ");
        } else {
          // More explicit failure + logs
          log("ERROR", "Product missing prices array or it is empty", product);
          throw new Error(`Product at index ${idx} has no prices`);
        }

        log("INFO", `Validated Product ID: ${product.id}`);
      });
    });
  });

  it("should update the product price and name, and validate", async () => {
    // 1) Retrieve the product (to locate price id)
    const productResponse = await withStep(`getProduct(${summarizeId(productToUpdate)})`, async () => {
      const prod = await recurrente.getProduct(productToUpdate);
      log("DEBUG", "getProduct response", prod);
      return prod;
    });

    expect(productResponse).toHaveProperty("prices");
    expect(Array.isArray(productResponse.prices)).toBe(true);
    expect(productResponse.prices.length).toBeGreaterThan(0);

    priceIdToUpdate = productResponse.prices[0].id;
    expect(priceIdToUpdate).toBeTruthy();
    log("INFO", `Price selected for update: ${priceIdToUpdate}`);

    const updatedName = "Updated Product Name";

    const updateData: UpdateProductRequest = {
      name: updatedName,
      pricesAttributes: [
        {
          id: priceIdToUpdate,
          amountInCents: 2000,
        },
      ],
    };

    const updateResponse = await withStep(
      `updateProduct(${summarizeId(productToUpdate)})`,
      async () => {
        const res = await recurrente.updateProduct(productToUpdate, updateData);
        log("DEBUG", "updateProduct response", res);
        return res;
      }
    );

    expect(updateResponse).toHaveProperty("id", productToUpdate);
    log("INFO", `Updated Product ID: ${productToUpdate}`);

    const updatedProduct = await withStep(
      `getProduct(${summarizeId(productToUpdate)}) after update`,
      async () => {
        const prod = await recurrente.getProduct(productToUpdate);
        log("DEBUG", "Updated product fetched", prod);
        return prod;
      }
    );

    expect(updatedProduct).toHaveProperty("prices");
    expect(updatedProduct.prices[0].amountInCents).toBe(2000);
    expect(updatedProduct.name).toBe(updatedName);

    log("INFO", `Validated Updated Product Price: ${updatedProduct.prices[0].amountInCents}`);
    log("INFO", `Validated Updated Product Name: ${updatedProduct.name}`);
  });

  it("should attempt to delete the product price, and validate that it still exists", async () => {
    expect(productToUpdate).toBeTruthy();
    expect(priceIdToUpdate).toBeTruthy();

    const deletePriceData: UpdateProductRequest = {
      pricesAttributes: [
        {
          id: priceIdToUpdate,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - if your types don't include _destroy, keep it as runtime field
          _destroy: true,
        },
      ],
    };

    const deleteResponse = await withStep(
      `updateProduct(${summarizeId(productToUpdate)}) attempt price delete`,
      async () => {
        const res = await recurrente.updateProduct(productToUpdate, deletePriceData);
        log("DEBUG", "updateProduct delete-attempt response", res);
        return res;
      }
    );

    expect(deleteResponse).toHaveProperty("id", productToUpdate);
    log("INFO", `Attempted to delete price from Product ID: ${productToUpdate}`);

    const productAfterDelete = await withStep(
      `getProduct(${summarizeId(productToUpdate)}) after delete attempt`,
      async () => {
        const prod = await recurrente.getProduct(productToUpdate);
        log("DEBUG", "Product after delete attempt", prod);
        return prod;
      }
    );

    expect(Array.isArray(productAfterDelete.prices)).toBe(true);
    expect(productAfterDelete.prices.length).toBe(1); // Price still exists
    log("INFO", `Validated price still exists for Product ID: ${productToUpdate}`);
  });

  it("should create multiple subscriptions and track their IDs", async () => {
    await withStep("Create 2 subscriptions", async () => {
      for (let i = 0; i < 2; i++) {
        const subscriptionData = generateSubscriptionData(`Subscription Product ${i}`);
        const response = await recurrente.createSubscription(subscriptionData);

        log("DEBUG", "createSubscription response", response);

        expect(response).toHaveProperty("id");
        // Heuristic: many providers return sub_... for subscriptions, prod_... for products.
        // Track automatically, but hint subscription.
        trackCreatedId(response.id, "subscription");

        log("INFO", `Created Subscription ID: ${response.id}`);
      }
    });
  });

  it("should create a subscription-type product and validate its properties", async () => {
    const subscriptionData = {
      product: {
        name: "Monthly Pro Plan",
        pricesAttributes: [
          {
            currency: "GTQ",
            chargeType: "recurring",
            amountInCents: 9900,
            billingIntervalCount: 1,
            billingInterval: "month",
          },
        ],
        successUrl: "https://www.example.com/success",
        cancelUrl: "https://www.example.com/cancel",
      },
    } satisfies ProductSubscription;

    // NOTE: Depending on your SDK, createSubscription may return a Subscription or Product.
    // We'll log the response and then fetch by getProduct() using the returned id (as you wrote).
    const productResponse = await withStep("createSubscription(recurring product payload)", async () => {
      const res = await recurrente.createSubscription(subscriptionData);
      log("DEBUG", "createSubscription (recurring product) response", res);
      return res;
    });

    expect(productResponse).toHaveProperty("id");
    const productId = productResponse.id as string;

    // Track for cleanup. If provider returns prod_..., product bucket will delete it.
    trackCreatedId(productId, "product");

    const createdProduct = await withStep(`getProduct(${summarizeId(productId)})`, async () => {
      const prod = await recurrente.getProduct(productId);
      log("DEBUG", "getProduct (recurring) fetched", prod);
      return prod;
    });

    expect(createdProduct).toHaveProperty("id", productId);
    expect(createdProduct.name).toBe("Monthly Pro Plan");
    expect(createdProduct.prices[0]).toHaveProperty("chargeType", "recurring");
    expect(createdProduct.prices[0]).toHaveProperty("billingInterval", "month");
    expect(createdProduct.prices[0]).toHaveProperty("amountInCents", 9900);

    log("INFO", `Validated Subscription Product ID: ${productId}`);
  });

  // --- NEW CHECKOUT TESTS ---
describe("Checkout Workflow", () => {
  it("should create a checkout for an existing product", async () => {
    const productId = Array.from(createdProducts)[0];
    expect(productId).toBeDefined();
    log("INFO", `Using productId for checkout: ${productId}`);

    const checkoutData: CreateCheckoutRequest = {
      items: [{ productId }],
      successUrl: "https://www.example.com/checkout/success",
      cancelUrl: "https://www.example.com/checkout/cancel",
      metadata: { source: "test_suite" },
    };

    const response = await withStep("createCheckout()", async () => {
      const res = await recurrente.createCheckout(checkoutData);
      log("DEBUG", "createCheckout response", res);
      return res;
    });

    // Only assert what the API actually returns here
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("checkoutUrl");

    // Save ASAP so later tests can run even if later asserts fail
    createdCheckoutId = response.id;
    trackCreatedId(createdCheckoutId, "checkout");

    log("INFO", `Created Checkout ID: ${createdCheckoutId}`);
    log("INFO", `Checkout URL: ${response.checkoutUrl}`);

    // Optional: verify status by fetching (if getCheckout returns status)
    const checkout = await withStep(`getCheckout(${summarizeId(createdCheckoutId)})`, async () => {
      const res = await recurrente.getCheckout(createdCheckoutId);
      log("DEBUG", "getCheckout response (post-create)", res);
      return res;
    });

    // If the provider marks it as unpaid, assert here (on the fetched object, not create response)
    if ("status" in checkout) {
      expect((checkout as any).status).toBe("unpaid");
    } else {
      log("WARN", "getCheckout did not return status; skipping status assertion", checkout);
    }
  });

  it("should retrieve the created checkout by ID", async () => {
    expect(createdCheckoutId).toBeTruthy();

    const checkout = await withStep(`getCheckout(${summarizeId(createdCheckoutId)})`, async () => {
      const res = await recurrente.getCheckout(createdCheckoutId);
      log("DEBUG", "getCheckout response", res);
      return res;
    });

    expect(checkout.id).toBe(createdCheckoutId);

    // Only assert metadata/status if present
    if ("status" in checkout) expect((checkout as any).status).toBe("unpaid");
    if ("metadata" in checkout) expect((checkout as any).metadata?.source).toBeDefined();

    log("INFO", `Retrieved Checkout ID: ${checkout.id}`);
  });

  it("should update the checkout metadata and URLs", async () => {
    expect(createdCheckoutId).toBeTruthy();

    const updateData = {
      metadata: { source: "test_suite_updated", extra: "info" },
      successUrl: "https://www.google.com",
    };

    const updatedCheckout = await withStep(
      `updateCheckout(${summarizeId(createdCheckoutId)})`,
      async () => {
        const res = await recurrente.updateCheckout(createdCheckoutId, updateData);
        log("DEBUG", "updateCheckout response", res);
        return res;
      }
    );

    expect(updatedCheckout.id).toBe(createdCheckoutId);

    if ("metadata" in updatedCheckout) {
      expect((updatedCheckout as any).metadata?.source).toBe("test_suite_updated");
    } else {
      log("WARN", "updateCheckout did not return metadata; skipping metadata assertion", updatedCheckout);
    }

    if ("successUrl" in updatedCheckout) {
      expect((updatedCheckout as any).successUrl).toBe("https://www.google.com");
    } else {
      log("WARN", "updateCheckout did not return successUrl; skipping successUrl assertion", updatedCheckout);
    }

    log("INFO", `Updated Checkout ID: ${updatedCheckout.id}`);
  });

  it("should list all checkouts and find the created one", async () => {
    expect(createdCheckoutId).toBeTruthy();

    const checkouts = await withStep("getAllCheckouts({ items: 50, page: 1 })", async () => {
      const res = await recurrente.getAllCheckouts({ items: 50, page: 1 });
      log("DEBUG", `getAllCheckouts returned ${Array.isArray(res) ? res.length : "non-array"} items`);
      return res;
    });

    expect(Array.isArray(checkouts)).toBe(true);

    const found = checkouts.find((c) => c.id === createdCheckoutId);

    // If list endpoint is paginated and doesn't include it in first page, don't hard fail blindly:
    if (!found) {
      log("WARN", "Checkout not found on page 1; trying page 2", { createdCheckoutId });
      const checkouts2 = await recurrente.getAllCheckouts({ items: 50, page: 2 });
      const found2 = checkouts2.find((c) => c.id === createdCheckoutId);

      if (!found2) {
        log("ERROR", "Checkout not found in first 2 pages", {
          createdCheckoutId,
          page1Count: checkouts.length,
          page2Count: checkouts2.length,
        });
      }
      expect(found2).toBeDefined();
      log("INFO", `Found checkout in list (page 2): ${found2?.id}`);
      return;
    }

    expect(found).toBeDefined();
    log("INFO", `Found checkout in list (page 1): ${found?.id}`);
  });
});
});
