import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * A utility function for making API requests with the Fetch API.
 *
 * @param {string} endpoint - The API endpoint (relative to the base API URL) to which the request will be sent.
 * @param {string|null} token - (Optional) Bearer token for authorization. If provided, it will be included in the Authorization header.
 * @param {Object|null} payload - (Optional) The request body to send for methods like POST or PUT. Should be a plain object; will be stringified to JSON.
 * @param {string} method - (Optional) The HTTP method to use for the request. Defaults to 'GET'.
 * @returns {Promise<Object>} - A Promise that resolves to the parsed JSON response from the server, or throws an error if the request fails.
 * @throws {Error} - Throws an error if the request fails or if the response status is not OK (i.e., not in the range 200–299).
 */
export const apiFetch = async (endpoint, token = null, payload = null, method = 'GET') => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method: method,
    headers: headers,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
