import axios, { type AxiosInstance } from 'axios';

// 1. This variable will hold our single client instance. It starts as null.
let _clientInstance: AxiosInstance | null = null;

/**
 * Factory function to get a configured Axios instance for Recurrente.
 * It uses a singleton pattern to ensure the client is only created once per server instance.
 * @returns {AxiosInstance} The configured Axios client.
 * @throws {Error} If environment variables are missing AT RUNTIME.
 */
export function getClient(): AxiosInstance {
  // 2. If the instance already exists, return it immediately.
  if (_clientInstance) {
    return _clientInstance;
  }

  // 3. If it doesn't exist, this is the first time the function is called.
  //    Now, and only now, do we read the environment variables.
  const baseURL = process.env.RECURRENTE_BASE_URL;
  const publicKey = process.env.RECURRENTE_PUBLIC_KEY;
  const secretKey = process.env.RECURRENTE_SECRET_KEY;

  // 4. Validate the secrets. This will throw a clear error at runtime if they are missing.
  if (!baseURL) {
    throw new Error('Missing Recurrente base URL at runtime. Check your environment variables.');
  }
  if (!publicKey) {
    throw new Error('Missing Recurrente Public Key at runtime. Check your environment variables.');
  }
  if (!secretKey) {
    throw new Error('Missing Recurrente Secret Key at runtime. Check your environment variables.');
  }

  // 5. Create the new Axios instance.
  const client: AxiosInstance = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
      'X-PUBLIC-KEY': publicKey,
      'X-SECRET-KEY': secretKey,
      'Content-Type': 'application/json',
    },
  });

  // 6. Store the newly created instance in our private variable and return it.
  _clientInstance = client;
  return _clientInstance;
}