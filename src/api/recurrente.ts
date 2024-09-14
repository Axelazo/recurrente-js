import axios from 'axios';
import client from '../config/axiosInstance';
import {
  ProductSubscription,
  CreateSubscriptionResponse,
  ErrorResponse,
  SubscriptionStatusResponse,
  CreateProductRequest,
  CreateProductResponse,
  GetProductResponse,
  GetAllProductsResponse,
  UpdateProductRequest,
} from '../types/globals';
import {toSnakeCase, toCamelCase} from '../utils/conversion';

/**
 * Creates a new product with a one-time payment.
 *
 * This function takes the product data, converts it to snake_case,
 * and sends it to the API to create a new one-time payment product.
 * It returns the created product's details.
 *
 * @param {CreateProductRequest} productData - The product details for the one-time payment.
 * @returns {Promise<CreateProductResponse>} The response containing product details.
 * @throws {ErrorResponse} Throws an error if the product creation fails.
 */
const createProduct = async (
  productData: CreateProductRequest
): Promise<CreateProductResponse> => {
  try {
    const productDataInSnakeCase = toSnakeCase(productData);

    const response = await client.post<CreateProductResponse>(
      '/products/',
      productDataInSnakeCase
    );

    return toCamelCase(response.data); // Return the created product's details
  } catch (error: unknown) {
    // Handle errors via the centralized error handler
    throw handleAxiosError(error);
  }
};

/**
 * Retrieves details of a specific product by its ID.
 *
 * This function fetches details of an existing product by making a GET request
 * to the API using the provided product ID. It returns the product's details.
 *
 * @param {string} productId - The ID of the product to retrieve.
 * @returns {Promise<GetProductResponse>} The response containing the product details.
 * @throws {ErrorResponse} Throws an error if the product retrieval fails.
 */
const getProduct = async (productId: string): Promise<GetProductResponse> => {
  try {
    const response = await client.get<GetProductResponse>(
      `/products/${productId}`
    );
    return toCamelCase(response.data);
  } catch (error: unknown) {
    throw handleAxiosError(error); // Handle errors via the centralized error handler
  }
};

/**
 * Retrieves a list of all products.
 *
 * This function fetches a paginated list of products from the API.
 * By default, it retrieves the 10 most recent products, but pagination
 * can be controlled using query parameters.
 *
 * @param {number} [page=1] - The page number to retrieve, defaults to the first page.
 * @returns {Promise<GetAllProductsResponse>} The response containing an array of product details.
 * @throws {ErrorResponse} Throws an error if the product retrieval fails.
 */
const getAllProducts = async (page = 1): Promise<GetAllProductsResponse> => {
  try {
    const response = await client.get<GetAllProductsResponse>(
      `/products?page=${page}`
    );
    return toCamelCase(response.data);
  } catch (error: unknown) {
    throw handleAxiosError(error); // Handle errors via the centralized error handler
  }
};

/**
 * Updates an existing product by its ID.
 *
 * This function takes the product ID and an object containing the updated product details.
 * It sends a PATCH request to the API to update the specified product. You can also
 * modify product prices or delete them by passing the _destroy parameter in prices_attributes.
 *
 * @param {string} productId - The ID of the product to update.
 * @param {UpdateProductRequest} productData - The updated product details.
 * @returns {Promise<GetProductResponse>} A promise that resolves with the updated product's details.
 * @throws {ErrorResponse} Throws an error if the product update fails.
 */
const updateProduct = async (
  productId: string,
  productData: UpdateProductRequest
): Promise<GetProductResponse> => {
  try {
    const productDataInSnakeCase = toSnakeCase(productData);

    const response = await client.patch<GetProductResponse>(
      `/products/${productId}`,
      productDataInSnakeCase
    );

    return toCamelCase(response.data); // Return the updated product's details
  } catch (error: unknown) {
    throw handleAxiosError(error); // Handle errors via the centralized error handler
  }
};

/**
 * Creates a new subscription for a product.
 *
 * This function takes a product's subscription data, converts it to snake_case,
 * and sends it to the API to create a new subscription. It returns the created
 * subscription's details.
 *
 * @param {ProductSubscription} productData - The subscription details for the product.
 * @returns {Promise<CreateSubscriptionResponse>} The response containing subscription details.
 * @throws {ErrorResponse} Throws an error if the subscription creation fails.
 */
const createSubscription = async (
  productData: ProductSubscription
): Promise<CreateSubscriptionResponse> => {
  try {
    const productDataInSnakeCase = toSnakeCase(productData);

    const response = await client.post<CreateSubscriptionResponse>(
      '/products/',
      productDataInSnakeCase
    );

    return toCamelCase(response.data); // Return the success response only
  } catch (error: unknown) {
    // Throw an error to handle it in a higher-level function or component
    throw handleAxiosError(error);
  }
};

/**
 * Cancels an existing subscription by its ID.
 *
 * This function sends a request to cancel the subscription specified by the
 * subscription ID. It returns a message indicating the success of the operation.
 *
 * @param {string} subscriptionId - The ID of the subscription to cancel.
 * @returns {Promise<{message: string}>} A message indicating whether the subscription was canceled successfully.
 * @throws {ErrorResponse} Throws an error if the cancellation fails.
 */
const cancelSubscription = async (
  subscriptionId: string
): Promise<{message: string}> => {
  try {
    const response = await client.delete(`/subscriptions/${subscriptionId}`);
    return {
      message: `Subscription canceled successfully. Status: ${response.status}`,
    };
  } catch (error: unknown) {
    throw handleAxiosError(error);
  }
};

/**
 * Deletes a product by its ID.
 *
 * This function deletes a product from the system using the product ID. It
 * returns a message indicating whether the product was deleted successfully.
 *
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<{message: string}>} A message indicating whether the product was deleted successfully.
 * @throws {ErrorResponse} Throws an error if the deletion fails.
 */
const deleteProduct = async (productId: string): Promise<{message: string}> => {
  try {
    await client.delete(`/products/${productId}`);

    return {message: 'Product deleted successfully'};
  } catch (error: unknown) {
    throw handleAxiosError(error);
  }
};

/**
 * Retrieves details of a specific subscription by its ID.
 *
 * This function fetches details of an existing subscription by making a GET request
 * using the subscription ID.
 *
 * @param {string} subscriptionId - The ID of the subscription to retrieve.
 * @returns {Promise<SubscriptionStatusResponse>} The details of the subscription.
 * @throws {ErrorResponse} Throws an error if the retrieval fails.
 */
const getSubscription = async (
  subscriptionId: string
): Promise<SubscriptionStatusResponse> => {
  try {
    const response = await client.get<SubscriptionStatusResponse>(
      `/subscriptions/${subscriptionId}`
    );

    return toCamelCase(response.data);
  } catch (error: unknown) {
    throw handleAxiosError(error);
  }
};

/**
 * Centralized error handler for Axios requests.
 *
 * This function checks if the error is from Axios and extracts meaningful
 * information from the response or throws a general error message if the error
 * is not from Axios.
 *
 * @param {unknown} error - The error object caught during an API request.
 * @returns {ErrorResponse} An object containing error details such as status and message.
 */
function handleAxiosError(error: unknown): ErrorResponse {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data) {
      return {
        status: 'error',
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors || {},
      };
    }
    return {
      status: 'error',
      message: error.message || 'Unknown Axios error occurred',
    };
  } else {
    return {
      status: 'error',
      message: 'An unknown error occurred',
    };
  }
}

/**
 * Makes a GET request to the '/test' endpoint.
 *
 * This function is not exported and is intended for internal use.
 *
 * @returns {Promise<{message: string}>} A message indicating success or failure of the request.
 * @throws {ErrorResponse} Throws an error if the request fails.
 */
const test = async (): Promise<{message: string}> => {
  try {
    const response = await client.get<Record<string, string>>('/test');
    return {
      message: `Test request succeeded. Status: ${response.data.message}`,
    };
  } catch (error: unknown) {
    throw handleAxiosError(error);
  }
};

/**
 * Recurrente API utility for managing product subscriptions, cancellations, and product deletions.
 *
 * The `recurrente` object provides methods to create, cancel, retrieve, and delete subscriptions and products,
 * making it easy to integrate Recurrente's payment services into your project.
 *
 * @namespace recurrente
 * @property {Function} test - Test endpoint.
 * @property {Function} createProduct - Creates a new product with a one-time payment.
 * @property {Function} getProduct - Retrieves details of a specific product by its ID.
 * @property {Function} getAllProducts - Retrieves a paginated list of all products.
 * @property {Function} updateProduct - Updates an existing product by its ID.
 * @property {Function} deleteProduct - Deletes a product by its ID.
 * @property {Function} createSubscription - Creates a new subscription for a product.
 * @property {Function} cancelSubscription - Cancels an existing subscription by its ID.
 * @property {Function} getSubscription - Retrieves details of a specific subscription by its ID.
 */
const recurrente = {
  /**
   * Makes a GET request to the '/test' endpoint.
   *
   * **FOR DEVELOPMENT PURPOSES ONLY TO TEST**
   *
   * This method is included for testing internal API functionality.
   *
   * @function
   * @memberof recurrente
   * @returns {Promise<{message: string}>} A message indicating the success or failure of the request.
   * @throws {ErrorResponse} Throws an error if the request fails.
   */
  test,
  /**
   * Creates a new product with a one-time payment.
   *
   * This function takes the product data, converts it to snake_case,
   * and sends it to the API to create a one-time payment product.
   * It returns the created product's details.
   *
   * @function
   * @memberof recurrente
   * @see createProduct
   * @param {CreateProductRequest} productData - The details of the product to create.
   * @returns {Promise<CreateProductResponse>} A promise that resolves with the created product's details.
   * @throws {ErrorResponse} Throws an error if the product creation fails.
   */
  createProduct,

  /**
   * Retrieves details of a specific product by its ID.
   *
   * This function fetches details of an existing product by making a GET request
   * using the product ID.
   *
   * @function
   * @memberof recurrente
   * @see getProduct
   * @param {string} productId - The ID of the product to retrieve.
   * @returns {Promise<GetProductResponse>} The details of the product.
   * @throws {ErrorResponse} Throws an error if the retrieval fails.
   */
  getProduct,

  /**
   * Retrieves a paginated list of all products.
   *
   * This function fetches a list of products from the API. By default, it retrieves
   * the 10 most recent products, but pagination can be controlled using query parameters.
   *
   * @function
   * @memberof recurrente
   * @see getAllProducts
   * @param {number} [page=1] - The page number to retrieve, defaults to the first page.
   * @returns {Promise<GetAllProductsResponse>} A promise that resolves with an array of product details.
   * @throws {ErrorResponse} Throws an error if the product retrieval fails.
   */
  getAllProducts,

  /**
   * Updates an existing product by its ID.
   *
   * This function takes the product ID and an object containing the updated product details.
   * It sends a PATCH request to the API to update the specified product. You can also
   * modify product prices or delete them by passing the _destroy parameter in prices_attributes.
   *
   * @function
   * @memberof recurrente
   * @see updateProduct
   * @param {string} productId - The ID of the product to update.
   * @param {UpdateProductRequest} productData - The updated product details.
   * @returns {Promise<GetProductResponse>} A promise that resolves with the updated product's details.
   * @throws {ErrorResponse} Throws an error if the product update fails.
   */
  updateProduct,

  /**
   * Deletes a product by its ID.
   *
   * @function
   * @memberof recurrente
   * @see deleteProduct
   */
  deleteProduct,

  /**
   * Creates a new subscription for a product.
   *
   * @function
   * @memberof recurrente
   * @see createSubscription
   */
  createSubscription,

  /**
   * Cancels an existing subscription by its ID.
   *
   * @function
   * @memberof recurrente
   * @see cancelSubscription
   */
  cancelSubscription,

  /**
   * Retrieves details of a specific subscription by its ID.
   *
   * @function
   * @memberof recurrente
   * @see getSubscription
   */
  getSubscription,
};

export default recurrente;
