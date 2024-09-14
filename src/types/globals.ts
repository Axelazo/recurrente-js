/*

Products and Subscriptions

*/

/**
 * Represents the details required to create a product.
 */
export interface CreateProductRequest {
  /**
   * The name of the product.
   * @required
   */
  name: string;

  /**
   * Optional description of the product.
   * @optional
   */
  description?: string;

  /**
   * Optional URL for the product image.
   * @optional
   */
  imageUrl?: string;

  /**
   * An array of price attributes for the product, including currency, charge type, and amount.
   * @required
   */
  pricesAttributes: {
    /**
     * The currency for the price (GTQ or USD).
     * @required
     */
    currency: 'GTQ' | 'USD';

    /**
     * The charge type for the product, e.g., 'one_time'.
     * @required
     */
    chargeType: 'one_time';

    /**
     * The amount to charge in cents.
     * @required
     */
    amountInCents: number;
  }[];

  /**
   * Optional URL to redirect the user after canceling the transaction.
   * @optional
   */
  cancelUrl?: string;

  /**
   * Optional URL to redirect the user after a successful transaction.
   * @optional
   */
  successUrl?: string;

  /**
   * Optional custom terms and conditions for the product.
   * @optional
   */
  customTermsAndConditions?: string;

  /**
   * Defines whether a phone number is required ('required', 'optional', or 'none').
   * @required
   */
  phoneRequirement: 'required' | 'optional' | 'none';

  /**
   * Defines whether an address is required ('required', 'optional', or 'none').
   * @required
   */
  addressRequirement: 'required' | 'optional' | 'none';

  /**
   * Defines whether billing information is required ('optional' or 'none').
   * @required
   */
  billingInfoRequirement: 'optional' | 'none';

  /**
   * Whether the quantity of the product is adjustable by the customer.
   * @optional
   */
  adjustableQuantity?: boolean;

  /**
   * Optional metadata for additional information about the product.
   * @optional
   */
  metadata?: Record<string, string>;
}

/**
 * Represents the response after creating a product.
 */
export interface CreateProductResponse {
  /**
   * The unique identifier for the product.
   * @required
   */
  id: string;

  /**
   * The status of the product, either 'active' or 'inactive'.
   * @required
   */
  status: 'active' | 'inactive';

  /**
   * The name of the product.
   * @required
   */
  name: string;

  /**
   * Optional description of the product.
   * @optional
   */
  description?: string;

  /**
   * URL to redirect the user after a successful transaction.
   * @required
   */
  successUrl: string;

  /**
   * URL to redirect the user after canceling the transaction.
   * @required
   */
  cancelUrl: string;

  /**
   * Optional custom terms and conditions for the product.
   * @optional
   */
  customTermsAndConditions?: string;

  /**
   * Defines whether a phone number is required ('required', 'optional', or 'none').
   * @required
   */
  phoneRequirement: 'required' | 'optional' | 'none';

  /**
   * Defines whether an address is required ('required', 'optional', or 'none').
   * @required
   */
  addressRequirement: 'required' | 'optional' | 'none';

  /**
   * Defines whether billing information is required ('optional' or 'none').
   * @required
   */
  billingInfoRequirement: 'optional' | 'none';

  /**
   * An array of price attributes for the product, including currency, charge type, and amount.
   * @required
   */
  prices: {
    /**
     * The unique identifier for the price object.
     * @required
     */
    id: string;

    /**
     * The amount to charge in cents.
     * @required
     */
    amountInCents: number;

    /**
     * The currency for the price (GTQ or USD).
     * @required
     */
    currency: 'GTQ' | 'USD';

    /**
     * The charge type for the product, e.g., 'one_time'.
     * @required
     */
    chargeType: 'one_time';
  }[];

  /**
   * A storefront link for the product.
   * @required
   */
  storefrontLink: string;

  /**
   * Optional metadata for additional information about the product.
   * @optional
   */
  metadata?: Record<string, string>;
}

/**
 * Represents the response from the API when fetching a product by its ID.
 */
export interface GetProductResponse {
  /**
   * The unique identifier for the product.
   */
  id: string;
  /**
   * The status of the product (e.g., active, inactive).
   */
  status: 'active' | 'inactive';
  /**
   * The name of the product.
   */
  name: string;
  /**
   * Optional description of the product.
   */
  description?: string;
  /**
   * URL to redirect the user after a successful checkout.
   */
  successUrl: string;
  /**
   * URL to redirect the user after canceling.
   */
  cancelUrl: string;
  /**
   * Optional custom terms and conditions for the product.
   */
  customTermsAndConditions?: string;
  /**
   * Defines whether a phone number is required ('required', 'optional', or 'none').
   */
  phoneRequirement: 'required' | 'optional' | 'none';
  /**
   * Defines whether an address is required ('required', 'optional', or 'none').
   */
  addressRequirement: 'required' | 'optional' | 'none';
  /**
   * Defines whether billing information is required ('optional' or 'none').
   */
  billingInfoRequirement: 'optional' | 'none';
  /**
   * The price details associated with the product.
   */
  prices: {
    /**
     * The unique identifier for the price object.
     */
    id: string;
    /**
     * The amount to charge in cents.
     */
    amountInCents: number;
    /**
     * The currency for the price (GTQ or USD).
     */
    currency: 'GTQ' | 'USD';
    /**
     * The count of the billing interval (e.g., every 1 month).
     */
    billingIntervalCount: number;
    /**
     * The billing interval period (e.g., month, week, year).
     */
    billingInterval: 'month' | 'week' | 'year' | '';
    /**
     * The charge type (e.g., one_time or recurring).
     */
    chargeType: 'one_time' | 'recurring';
    /**
     * Optional number of periods before automatic cancellation.
     */
    periodsBeforeAutomaticCancellation?: number | null;
    /**
     * Optional free trial interval count.
     */
    freeTrialIntervalCount?: number | null;
    /**
     * Optional free trial interval period.
     */
    freeTrialInterval?: 'month' | 'week' | 'year' | null;
  }[];
  /**
   * The storefront link for the product.
   */
  storefrontLink: string;
  /**
   * Optional metadata for additional information about the product.
   */
  metadata?: Record<string, string>;
}

/**
 * Represents the response from the API when fetching all products.
 * It is an array of product objects.
 */
export type GetAllProductsResponse = GetProductResponse[];

/**
 * Represents the details required to update a product.
 * Includes optional parameters for updating product attributes and deleting prices.
 */
export interface UpdateProductRequest {
  /**
   * The name of the product.
   * @optional
   */
  name?: string;

  /**
   * Optional description of the product.
   * @optional
   */
  description?: string;

  /**
   * URL to redirect the user after a successful transaction.
   * @optional
   */
  successUrl?: string;

  /**
   * URL to redirect the user after canceling.
   * @optional
   */
  cancelUrl?: string;

  /**
   * Optional custom terms and conditions for the product.
   * @optional
   */
  customTermsAndConditions?: string;

  /**
   * Defines whether a phone number is required ('required', 'optional', or 'none').
   * @optional
   */
  phoneRequirement?: 'required' | 'optional' | 'none';

  /**
   * Defines whether an address is required ('required', 'optional', or 'none').
   * @optional
   */
  addressRequirement?: 'required' | 'optional' | 'none';

  /**
   * Defines whether billing information is required ('optional' or 'none').
   * @optional
   */
  billingInfoRequirement?: 'optional' | 'none';

  /**
   * Optional array of price attributes, including details for updating or deleting prices.
   * @optional
   */
  pricesAttributes?: {
    /**
     * The unique identifier for the price object.
     */
    id: string;

    /**
     * The amount to charge in cents.
     * @optional
     */
    amountInCents?: number;

    /**
     * The currency for the price (GTQ or USD).
     * @optional
     */
    currency?: 'GTQ' | 'USD';

    /**
     * The billing interval count (e.g., every 1 month).
     * @optional
     */
    billingIntervalCount?: number;

    /**
     * The billing interval period (e.g., month, week, year).
     * @optional
     */
    billingInterval?: 'month' | 'week' | 'year' | '';

    /**
     * The charge type (e.g., one_time or recurring).
     * @optional
     */
    chargeType?: 'one_time' | 'recurring';

    /**
     * Indicates if the price should be deleted.
     * @optional
     */
    _destroy?: boolean;
  }[];

  /**
   * Optional metadata for additional information about the product.
   * @optional
   */
  metadata?: Record<string, string>;
}

/**
 * Represents the details of a product subscription.
 */
export interface ProductSubscription {
  product: {
    /**
     * The name of the product.
     * @required
     */
    name: string;
    /**
     * Optional description of the product.
     * Provides a brief overview or additional details about the product.
     */
    description?: string;
    /**
     * Optional URL for the product image.
     * Can be used to display an image associated with the product.
     */
    imageUrl?: string;
    /**
     * The pricing details of the product.
     * @required
     */
    pricesAttributes: {
      /**
       * The currency for the product, e.g., GTQ (Guatemalan Quetzal) or USD (United States Dollar).
       * @required
       */
      currency: 'GTQ' | 'USD';
      /**
       * The charge type for the subscription.
       * Currently, only 'recurring' is supported, indicating that charges will happen periodically.
       * @required
       */
      chargeType: 'recurring';
      /**
       * The amount to charge in cents.
       * Represents the price of the product in the smallest currency unit (e.g., 100 cents = $1.00).
       * @required
       */
      amountInCents: number;
      /**
       * The interval count for billing.
       * Specifies the number of billing intervals between charges (e.g., every 1 month, every 3 weeks).
       * @required
       */
      billingIntervalCount: number;
      /**
       * The interval period for billing.
       * Specifies the time unit for billing intervals (e.g., month, week, year).
       * @required
       */
      billingInterval: 'month' | 'week' | 'year';
      /**
       * Optional free trial period count.
       * Specifies the number of free intervals before billing starts (e.g., 1 free month).
       */
      freeTrialIntervalCount?: number;
      /**
       * Optional free trial interval period.
       * Specifies the time unit for the free trial period (e.g., month, week, year).
       */
      freeTrialInterval?: 'month' | 'week' | 'year';
      /**
       * Optional number of periods before automatic cancellation.
       * Specifies the number of billing periods after which the subscription will be automatically canceled.
       */
      periodsBeforeAutomaticCancellation?: number;
      /**
       * Optional number of periods before the customer is allowed to cancel.
       * Specifies how many billing periods must pass before the customer is eligible to cancel the subscription.
       */
      periodsBeforeAllowedToCancel?: number;
    }[];
    /**
     * Optional URL to redirect the user after canceling.
     * If specified, the user will be redirected to this URL upon successful cancellation.
     */
    cancelUrl?: string;
    /**
     * Optional URL to redirect the user after a successful purchase or subscription.
     * If specified, the user will be redirected to this URL after a successful transaction.
     */
    successUrl?: string;
    /**
     * Optional custom terms and conditions for the product.
     * Allows the specification of custom terms that the customer must agree to.
     */
    customTermsAndConditions?: string;
    /**
     * Defines whether a phone number is required.
     * Options:
     * - 'required': A phone number must be provided.
     * - 'optional': A phone number is optional.
     * - 'none': A phone number is not required.
     */
    phoneRequirement?: 'required' | 'optional' | 'none';
    /**
     * Defines whether an address is required.
     * Options:
     * - 'required': An address must be provided.
     * - 'optional': An address is optional.
     * - 'none': An address is not required.
     */
    addressRequirement?: 'required' | 'optional' | 'none';
    /**
     * Defines whether billing information is required.
     * Options:
     * - 'optional': Billing information is optional.
     * - 'none': Billing information is not required.
     */
    billingInfoRequirement?: 'optional' | 'none';
    /**
     * Whether adjustable quantity is allowed.
     * If true, customers can adjust the quantity of the product they are subscribing to. Default is true.
     */
    adjustableQuantity?: boolean;
  };
  /**
   * Optional metadata for additional product information.
   * A key-value map to store extra information about the product (e.g., tags, custom properties).
   */
  metadata?: Record<string, string>;
}

/**
 * Represents the pricing details for a subscription.
 */
export interface SubscriptionPrice {
  /**
   * Unique identifier for the subscription price.
   */
  id: string;
  /**
   * The amount to charge in cents.
   * Represents the price of the product in the smallest currency unit (e.g., 100 cents = $1.00).
   */
  amountInCents: number;
  /**
   * The currency for the product, e.g., GTQ (Guatemalan Quetzal) or USD (United States Dollar).
   */
  currency: 'GTQ' | 'USD';
  /**
   * The billing interval count.
   * Specifies the number of billing intervals between charges (e.g., every 1 month, every 3 weeks).
   */
  billingIntervalCount: number;
  /**
   * The billing interval period.
   * Specifies the time unit for billing intervals (e.g., month, week, year).
   */
  billingInterval: 'month' | 'week' | 'year';
  /**
   * The charge type for the subscription.
   * Currently, only 'recurring' is supported, indicating that charges will happen periodically.
   */
  chargeType: 'recurring';
  /**
   * Optional number of periods before automatic cancellation.
   * Specifies the number of billing periods after which the subscription will be automatically canceled.
   * If null, automatic cancellation is not applicable.
   */
  periodsBeforeAutomaticCancellation?: number | null;
  /**
   * Optional free trial interval count.
   * Specifies the number of free intervals before billing starts (e.g., 1 free month).
   * If null, there is no free trial period.
   */
  freeTrialIntervalCount?: number | null;
  /**
   * Optional free trial interval period.
   * Specifies the time unit for the free trial period (e.g., month, week, year).
   * If null, there is no free trial period.
   */
  freeTrialInterval?: 'month' | 'week' | 'year' | null;
}

/**
 * Represents the response from creating a subscription.
 */
export interface CreateSubscriptionResponse {
  /**
   * Unique identifier for the created subscription.
   */
  id: string;
  /**
   * The status of the subscription.
   * Possible values:
   * - 'active': The subscription is currently active.
   * - 'inactive': The subscription is inactive.
   * - 'pending': The subscription is pending and may need further actions (e.g., verification).
   */
  status: 'active' | 'inactive' | 'pending';
  /**
   * The name of the subscription.
   */
  name: string;
  /**
   * Optional description of the subscription.
   * Provides additional details about the subscription.
   */
  description?: string;
  /**
   * The URL to redirect the user to after a successful subscription creation or payment.
   */
  successUrl: string;
  /**
   * The URL to redirect the user to if they cancel the subscription process.
   */
  cancelUrl: string;
  /**
   * Optional custom terms and conditions for the subscription.
   * Specifies any custom terms that the user must agree to when subscribing.
   */
  customTermsAndConditions?: string;
  /**
   * Defines whether a phone number is required.
   * Options:
   * - 'required': A phone number must be provided.
   * - 'optional': A phone number is optional.
   * - 'none': No phone number is required.
   */
  phoneRequirement: 'required' | 'optional' | 'none';
  /**
   * Defines whether an address is required.
   * Options:
   * - 'required': An address must be provided.
   * - 'optional': An address is optional.
   * - 'none': No address is required.
   */
  addressRequirement: 'required' | 'optional' | 'none';
  /**
   * Defines whether billing information is required.
   * Options:
   * - 'optional': Billing information is optional.
   * - 'none': Billing information is not required.
   */
  billingInfoRequirement: 'optional' | 'none';
  /**
   * An array of pricing details associated with the subscription.
   * Each item in the array represents a price option for the subscription.
   */
  prices: SubscriptionPrice[];
  /**
   * A storefront link for the subscription.
   * Provides a link to the storefront where the user can manage or view their subscription.
   */
  storefrontLink: string;
  /**
   * Optional metadata for additional information.
   * A key-value map to store extra information related to the subscription (e.g., tags, custom properties).
   */
  metadata?: Record<string, string>;
}

/**
 * Represents the details of a subscription status.
 */
export interface SubscriptionStatusResponse {
  /**
   * Unique identifier for the subscription.
   */
  id: string;
  /**
   * A description of the subscription.
   * Provides additional details or information about the subscription.
   */
  description: string;
  /**
   * The current status of the subscription.
   * Possible values:
   * - 'active': The subscription is currently active.
   * - 'inactive': The subscription is inactive.
   * - 'pending': The subscription is pending further action.
   * - 'canceled': The subscription has been canceled.
   */
  status: 'active' | 'inactive' | 'pending' | 'canceled';
  /**
   * The date and time when the subscription was created.
   * Represented as an ISO date string.
   */
  createdAt: string; // ISO date string
  /**
   * The date and time when the subscription was last updated.
   * Represented as an ISO date string.
   */
  updatedAt: string; // ISO date string
  /**
   * The start date and time of the current billing period.
   * Represented as an ISO date string.
   */
  currentPeriodStart: string; // ISO date string
  /**
   * The end date and time of the current billing period.
   * Represented as an ISO date string.
   */
  currentPeriodEnd: string; // ISO date string
  /**
   * The name of the tax applied to the subscription, if applicable.
   * If no tax is applied, this will be null.
   */
  taxName: string | null;
  /**
   * The tax identification number associated with the subscription, if applicable.
   * If no tax is applied, this will be null.
   */
  taxId: string | null;
  /**
   * Information about the subscriber.
   */
  subscriber: {
    /**
     * Unique identifier for the subscriber.
     */
    id: string;
    /**
     * The subscriber's first name.
     */
    firstName: string;
    /**
     * The subscriber's last name.
     */
    lastName: string;
    /**
     * The full name of the subscriber, typically a combination of first and last names.
     */
    fullName: string;
    /**
     * The subscriber's email address.
     */
    email: string;
    /**
     * The subscriber's phone number, if provided.
     * If no phone number is provided, this will be null.
     */
    phoneNumber: string | null;
  };
  /**
   * Information related to the subscription checkout.
   */
  checkout: {
    /**
     * Unique identifier for the checkout associated with this subscription.
     */
    id: string;
  };
  /**
   * Information related to the product associated with the subscription.
   */
  product: {
    /**
     * Unique identifier for the product.
     */
    id: string;
  };
}

/**
 * Represents an error response from the API.
 */
export interface ErrorResponse {
  /**
   * The status of the response, indicating an error occurred.
   * This field will always have the value 'error'.
   */
  status: 'error';
  /**
   * A descriptive message providing details about the error.
   * This message gives a general explanation of what went wrong.
   */
  message: string;
  /**
   * Optional validation errors for specific fields.
   * This is a key-value map where each key is the name of a field and the value is an array of error messages related to that field.
   * This is typically used for form or input validation errors.
   */
  errors?: Record<string, string[]>;
}

/*

Webhooks

*/

/**
 * Represents the details of a successful payment intent event.
 * This webhook event is triggered when a payment is successfully completed.
 */
export interface PaymentIntentSucceeded {
  /**
   * Unique identifier for the payment intent.
   */
  id: string;

  /**
   * The event type, which is 'payment_intent.succeeded' for this event.
   */
  eventType: 'payment_intent.succeeded';

  /**
   * The version of the API used during the event.
   */
  apiVersion: string;

  /**
   * Checkout details associated with the payment intent.
   */
  checkout: {
    /**
     * Unique identifier for the checkout session.
     */
    id: string;

    /**
     * The status of the checkout session.
     */
    status: string;

    /**
     * Payment details associated with the checkout.
     */
    payment: {
      /**
       * Unique identifier for the payment.
       */
      id: string;

      /**
       * Details about the entity responsible for the payment, e.g., a subscription or one-time payment.
       */
      paymentable: {
        /**
         * The type of paymentable entity (e.g., 'OneTimePayment').
         */
        type: string;

        /**
         * Unique identifier for the paymentable entity.
         */
        id: string;

        /**
         * The name of the tax applied, if applicable.
         * Null if no tax is applied.
         */
        taxName: string | null;

        /**
         * The tax identification number, if applicable.
         * Null if no tax is applied.
         */
        taxId: string | null;

        /**
         * The address associated with the payment, if provided.
         * Null if no address is provided.
         */
        address: string | null;

        /**
         * The phone number associated with the payment, if provided.
         * Null if no phone number is provided.
         */
        phoneNumber: string | null;
      };
    };

    /**
     * Details of the payment method used for the checkout.
     */
    paymentMethod: {
      /**
       * Unique identifier for the payment method.
       */
      id: string;

      /**
       * The type of payment method, e.g., 'card'.
       */
      type: string;

      /**
       * Card details for the payment method.
       */
      card: {
        /**
         * The last four digits of the card used.
         */
        last4: string;

        /**
         * The card network, e.g., 'visa'.
         */
        network: string;
      };
    };

    /**
     * Array of transfer setups, if any are needed for the payment.
     */
    transferSetups: string[];

    /**
     * Optional metadata for additional information.
     * This is a key-value map storing extra details about the checkout session.
     */
    metadata: Record<string, string>;
  };

  /**
   * The date and time when the payment intent was created, in ISO date format.
   */
  createdAt: string;

  /**
   * The reason for any failure, or null if the payment was successful.
   */
  failureReason: string | null;

  /**
   * The total amount of the payment in cents.
   */
  amountInCents: number;

  /**
   * The currency of the payment (e.g., 'GTQ', 'USD').
   */
  currency: string;

  /**
   * The fee charged for the transaction, in cents.
   */
  fee: number;

  /**
   * The amount of VAT withheld for the transaction, in cents.
   */
  vatWithheld: number;

  /**
   * The currency in which the VAT is withheld.
   */
  vatWithheldCurrency: string;

  /**
   * Customer details associated with the payment.
   */
  customer: {
    /**
     * The customer's email address.
     */
    email: string;

    /**
     * The customer's full name.
     */
    fullName: string;

    /**
     * Unique identifier for the customer.
     */
    id: string;
  };

  /**
   * Additional payment details.
   */
  payment: {
    /**
     * Unique identifier for the payment.
     */
    id: string;

    /**
     * Details about the paymentable entity, including address and tax information.
     */
    paymentable: {
      /**
       * Unique identifier for the paymentable entity.
       */
      id: string;

      /**
       * The tax identification number, if applicable.
       */
      taxId: string | null;

      /**
       * The name of the tax applied, if applicable.
       */
      taxName: string | null;

      /**
       * The type of paymentable entity (e.g., 'Subscription').
       */
      type: string;

      /**
       * The address associated with the paymentable entity.
       */
      address: {
        /**
         * The first line of the address.
         */
        addressLine1: string;

        /**
         * The second line of the address, if any.
         */
        addressLine2: string | null;

        /**
         * The city associated with the address.
         */
        city: string;

        /**
         * The country associated with the address.
         */
        country: string;

        /**
         * The postal code or zip code for the address.
         */
        zipCode: string;
      };

      /**
       * The phone number associated with the paymentable entity.
       */
      phoneNumber: string;
    };
  };

  /**
   * The product associated with the payment intent.
   */
  product: {
    /**
     * Unique identifier for the product.
     */
    id: string;
  };

  /**
   * Invoice details related to the payment, if available.
   */
  invoice: {
    /**
     * Unique identifier for the invoice.
     */
    id: string;

    /**
     * The URL to view or download the tax invoice, if available.
     * Null if no tax invoice is available.
     */
    taxInvoiceUrl: string | null;
  };
}

/**
 * Represents the details of a failed payment intent event.
 * This webhook event is triggered when a payment attempt fails.
 */
export interface PaymentIntentFailed {
  /**
   * Unique identifier for the payment intent.
   */
  id: string;

  /**
   * The event type, which is 'payment_intent.failed' for this event.
   */
  eventType: 'payment_intent.failed';

  /**
   * The version of the API used during the event.
   */
  apiVersion: string;

  /**
   * Checkout details associated with the failed payment intent.
   */
  checkout: {
    /**
     * Unique identifier for the checkout session.
     */
    id: string;
  };

  /**
   * The date and time when the payment intent was created, in ISO date format.
   */
  createdAt: string;

  /**
   * The reason for the failure of the payment attempt.
   */
  failureReason: string;

  /**
   * The total amount of the attempted payment in cents.
   */
  amountInCents: number;

  /**
   * The currency of the attempted payment (e.g., 'GTQ', 'USD').
   */
  currency: string;

  /**
   * The fee charged for the transaction, in cents, even if the payment failed.
   */
  fee: number;

  /**
   * The amount of VAT withheld for the transaction, in cents.
   */
  vatWithheld: number;

  /**
   * The currency in which the VAT is withheld.
   */
  vatWithheldCurrency: string;

  /**
   * Customer details associated with the failed payment attempt.
   */
  customer: {
    /**
     * The customer's email address.
     */
    email: string;

    /**
     * The customer's full name.
     */
    fullName: string;

    /**
     * Unique identifier for the customer.
     */
    id: string;
  };

  /**
   * Additional payment details.
   */
  payment: {
    /**
     * Unique identifier for the payment.
     */
    id: string;

    /**
     * Details about the paymentable entity, including address and tax information.
     */
    paymentable: {
      /**
       * Unique identifier for the paymentable entity.
       */
      id: string;

      /**
       * The tax identification number, if applicable.
       * Null if no tax is applied.
       */
      taxId: string | null;

      /**
       * The name of the tax applied, if applicable.
       * Null if no tax is applied.
       */
      taxName: string | null;

      /**
       * The type of paymentable entity (e.g., 'Subscription').
       */
      type: string;

      /**
       * The address associated with the paymentable entity.
       */
      address: {
        /**
         * The first line of the address.
         */
        addressLine1: string;

        /**
         * The second line of the address, if any.
         */
        addressLine2: string | null;

        /**
         * The city associated with the address.
         */
        city: string;

        /**
         * The country associated with the address.
         */
        country: string;

        /**
         * The postal code or zip code for the address.
         */
        zipCode: string;
      };

      /**
       * The phone number associated with the paymentable entity.
       */
      phoneNumber: string;
    };
  };

  /**
   * The product associated with the failed payment intent.
   */
  product: {
    /**
     * Unique identifier for the product.
     */
    id: string;
  };

  /**
   * Invoice details related to the payment, if available.
   */
  invoice: {
    /**
     * Unique identifier for the invoice.
     */
    id: string;

    /**
     * The URL to view or download the tax invoice, if available.
     * Null if no tax invoice is available.
     */
    taxInvoiceUrl: string | null;
  };
}

/**
 * Represents the details of a subscription creation event.
 * This webhook event is triggered when a new subscription is created.
 */
export interface SubscriptionCreate {
  /**
   * Unique identifier for the subscription event.
   */
  id: string;

  /**
   * The event type, which is 'subscription.create' for this event.
   */
  eventType: 'subscription.create';

  /**
   * The version of the API used during the event.
   */
  apiVersion: string;

  /**
   * The date and time when the subscription was created, in ISO date format.
   */
  createdAt: string;

  /**
   * The email address of the customer who created the subscription.
   */
  customerEmail: string;

  /**
   * Unique identifier for the customer.
   */
  customerId: string;

  /**
   * The full name of the customer who created the subscription.
   */
  customerName: string;
}

/**
 * Represents the details of a subscription past due event.
 * This webhook event is triggered when a subscription becomes past due, indicating that payment has not been made on time.
 */
export interface SubscriptionPastDue {
  /**
   * Unique identifier for the past due subscription event.
   */
  id: string;

  /**
   * The event type, which is 'subscription.past_due' for this event.
   */
  eventType: 'subscription.past_due';

  /**
   * The version of the API used during the event.
   */
  apiVersion: string;

  /**
   * The date and time when the subscription became past due, in ISO date format.
   */
  createdAt: string;

  /**
   * The email address of the customer with the past due subscription.
   */
  customerEmail: string;

  /**
   * Unique identifier for the customer with the past due subscription.
   */
  customerId: string;

  /**
   * The full name of the customer with the past due subscription.
   */
  customerName: string;
}

/**
 * Represents the details of a subscription paused event.
 * This webhook event is triggered when a subscription is paused.
 */
export interface SubscriptionPaused {
  /**
   * Unique identifier for the paused subscription event.
   */
  id: string;

  /**
   * The event type, which is 'subscription.paused' for this event.
   */
  eventType: 'subscription.paused';

  /**
   * The version of the API used during the event.
   */
  apiVersion: string;

  /**
   * The date and time when the subscription was paused, in ISO date format.
   */
  createdAt: string;

  /**
   * The email address of the customer with the paused subscription.
   */
  customerEmail: string;

  /**
   * Unique identifier for the customer with the paused subscription.
   */
  customerId: string;

  /**
   * The full name of the customer with the paused subscription.
   */
  customerName: string;
}

/**
 * Represents the details of a subscription cancellation event.
 * This webhook event is triggered when a subscription is canceled.
 */
export interface SubscriptionCancel {
  /**
   * Unique identifier for the canceled subscription event.
   */
  id: string;

  /**
   * The event type, which is 'subscription.cancel' for this event.
   */
  eventType: 'subscription.cancel';

  /**
   * The version of the API used during the event.
   */
  apiVersion: string;

  /**
   * The date and time when the subscription was canceled, in ISO date format.
   */
  createdAt: string;

  /**
   * The email address of the customer whose subscription was canceled.
   */
  customerEmail: string;

  /**
   * Unique identifier for the customer whose subscription was canceled.
   */
  customerId: string;

  /**
   * The full name of the customer whose subscription was canceled.
   */
  customerName: string;
}

/**
 * Represents the possible webhook events that can be triggered in the Recurrente system.
 * These events correspond to various stages of the payment or subscription lifecycle.
 */
export type RecurrenteWebhookEvent =
  | PaymentIntentSucceeded
  | PaymentIntentFailed
  | SubscriptionCreate
  | SubscriptionPastDue
  | SubscriptionPaused
  | SubscriptionCancel;

/**
 * A generic type for handling webhook events.
 * The handler function receives an event of type T and performs some action.
 *
 * @template T - The type of the webhook event being handled.
 * @param event - The webhook event object.
 */
export type WebhookHandler<T> = (event: T) => void;
