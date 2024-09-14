import axios, {AxiosInstance} from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const baseURL = process.env.RECURRENTE_BASE_URL;
const publicKey = process.env.RECURRENTE_PUBLIC_KEY;
const secretKey = process.env.RECURRENTE_SECRET_KEY;

if (!baseURL) {
  throw new Error('Missing Recurrente base URL');
}

if (!publicKey) {
  throw new Error('Missing Recurrente Public Key');
}

if (!secretKey) {
  throw new Error('Missing Recurrente Secret Key');
}

// Create an Axios instance with configuration
const client: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'X-PUBLIC-KEY': publicKey,
    'X-SECRET-KEY': secretKey,
    'Content-Type': 'application/json',
  },
});

// Export the Axios instance for use in other parts of the package
export default client;
