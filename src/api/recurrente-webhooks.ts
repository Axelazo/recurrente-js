import {Webhook} from 'svix';
import {
  PaymentIntentSucceeded,
  PaymentIntentFailed,
  SubscriptionCreate,
  SubscriptionPastDue,
  SubscriptionPaused,
  SubscriptionCancel,
  RecurrenteWebhookEvent,
} from '../types/globals';
import {toCamelCase} from '../utils/conversion';
import dotenv from 'dotenv';

// Load environment variables from .env file if they are not already set
dotenv.config();

/**
 * A handler function type definition.
 * @template T The type of the webhook event.
 */
type WebhookHandler<T> = (event: T) => void;

/**
 * A bivariant version of the WebhookHandler to relax variance constraints.
 * This allows assigning a handler with a specific event type to the handlers map.
 * @template T The type of the webhook event.
 */
type BivariantWebhookHandler<T> =
  | {
      (event: T): void;
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((event: any) => void);

/**
 * Mapping of event types to corresponding event interfaces.
 */
interface EventTypeMapping {
  'payment_intent.succeeded': PaymentIntentSucceeded;
  'payment_intent.failed': PaymentIntentFailed;
  'subscription.create': SubscriptionCreate;
  'subscription.past_due': SubscriptionPastDue;
  'subscription.paused': SubscriptionPaused;
  'subscription.cancel': SubscriptionCancel;
}

/**
 * A record to store the user-registered webhook handlers.
 * Each event type is mapped to its corresponding handler function.
 */
const userHandlers: Partial<{
  [K in keyof EventTypeMapping]: BivariantWebhookHandler<EventTypeMapping[K]>;
}> = {
  'payment_intent.succeeded': (event: PaymentIntentSucceeded) => {
    console.log('Default PaymentIntentSucceeded Handler:', event);
  },
  'payment_intent.failed': (event: PaymentIntentFailed) => {
    console.log('Default PaymentIntentFailed Handler:', event);
  },
  'subscription.create': (event: SubscriptionCreate) => {
    console.log('Default SubscriptionCreate Handler:', event);
  },
  'subscription.past_due': (event: SubscriptionPastDue) => {
    console.log('Default SubscriptionPastDue Handler:', event);
  },
  'subscription.paused': (event: SubscriptionPaused) => {
    console.log('Default SubscriptionPaused Handler:', event);
  },
  'subscription.cancel': (event: SubscriptionCancel) => {
    console.log('Default SubscriptionCancel Handler:', event);
  },
};

/**
 * Verifies the Svix webhook signature and parses the event.
 *
 * @param payload - The raw request body as a string.
 * @param headers - The request headers.
 * @returns The verified and parsed event.
 * @throws {Error} If the signature verification fails.
 */
function verifySvixSignature(
  payload: string,
  headers: Record<string, string | string[] | undefined>
): RecurrenteWebhookEvent {
  const signingSecret = process.env.RECURRENTE_SVIX_SIGNING_SECRET;

  if (!signingSecret) {
    throw new Error('Missing signing secret');
  }

  const svixHeaders = {
    'svix-id': headers['svix-id'] as string,
    'svix-timestamp': headers['svix-timestamp'] as string,
    'svix-signature': headers['svix-signature'] as string,
  };

  const svix = new Webhook(signingSecret);

  try {
    // Verify the signature and parse the event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event = svix.verify(payload, svixHeaders) as Record<string, any>;

    // Convert snake_case keys to camelCase
    const camelCasedEvent = toCamelCase(event);

    return camelCasedEvent as RecurrenteWebhookEvent;
  } catch (error) {
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Registers a custom webhook handler for a specific event type.
 *
 * @template T The type of the webhook event.
 * @param {keyof EventTypeMapping} eventType - The type of the event (e.g., 'payment_intent.succeeded').
 * @param {WebhookHandler<EventTypeMapping[T]>} handler - The custom handler function to register for this event type.
 *
 * @example
 * registerWebhookHandler('payment_intent.succeeded', (event) => {
 *   console.log(`Payment succeeded for: ${event.customer.email}`);
 *   // Custom logic for a successful payment
 * });
 */
function registerWebhookHandler<T extends keyof EventTypeMapping>(
  eventType: T,
  handler: WebhookHandler<EventTypeMapping[T]>
): void {
  userHandlers[eventType] = handler;
}

/**
 * Handles a verified webhook event by dispatching it to the appropriate registered or default handler.
 *
 * **Important Note:** Before calling this function, you must verify the webhook signature using `verifySvixSignature`
 * to ensure the event is authentic and has not been tampered with.
 *
 * @param {RecurrenteWebhookEvent} event - The verified webhook event object sent by Recurrente.
 *
 * @example
 * app.post('/webhook', (req, res) => {
 *   try {
 *     const payload = req.body;
 *     const headers = req.headers;
 *
 *     // Verify the signature and obtain the event
 *     const event = verifySvixSignature(payload, headers);
 *
 *     // Handle the verified event
 *     handleWebhookEvent(event);
 *
 *     res.status(200).send('Webhook processed');
 *   } catch (error) {
 *     console.error('Error processing webhook:', error);
 *     res.status(400).send('Invalid webhook signature');
 *   }
 * });
 *
 * @throws {Error} If no handler is found for the event type.
 */
function handleWebhookEvent(event: RecurrenteWebhookEvent): void {
  const handler = userHandlers[event.eventType as keyof EventTypeMapping];

  if (handler) {
    handler(event);
  } else {
    throw new Error(`No handler registered for event type: ${event.eventType}`);
  }
}

export {handleWebhookEvent, verifySvixSignature, registerWebhookHandler};
