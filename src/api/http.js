import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL?.trim();
if (!baseURL || !/^https?:\/\//i.test(baseURL)) {
  throw new Error('VITE_API_URL is missing or invalid. Set it and restart the Vite server.');
}

export const http = axios.create({
  baseURL: baseURL.replace(/\/$/, ''),
  withCredentials: true,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

export function unwrap(response) {
  const body = response?.data ?? response;
  return body && Object.prototype.hasOwnProperty.call(body, 'data') ? body.data : body;
}

export function apiError(error) {
  return apiErrorDetails(error).message;
}

export function apiErrorDetails(error) {
  if (!error?.response) {
    return {
      message: error?.code === 'ECONNABORTED'
        ? 'The request timed out. Check the backend and try again.'
        : `Unable to reach the backend at ${baseURL}. Check that it is running and that CORS is configured for this frontend.`,
      fieldErrors: {},
      status: null,
    };
  }

  const status = error.response.status;
  const body = error.response.data;
  if (typeof body === 'string') return { message: body, fieldErrors: {}, status };

  const details = Array.isArray(body?.errors) ? body.errors : [];
  const fieldErrors = details.reduce((result, item) => {
    const field = item.path || item.param || item.field;
    if (field && item.msg) result[field] = item.msg;
    return result;
  }, {});
  const backendMessage = typeof body?.message === 'string' ? body.message.trim() : '';
  const friendlyBackendMessages = {
    'user not existed': 'No account was found with that email or username.',
    'wrong password': 'The password is incorrect. Please try again.',
    'username or emmail is required': 'Enter your email or username to sign in.',
  };
  const statusMessages = {
    401: 'Your session has expired. Please sign in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This conflicts with an existing record. Check the values and try again.',
    413: 'The uploaded file is too large. Choose a smaller file.',
    500: 'The server could not complete the request. Please try again.',
  };
  return {
    message: Object.keys(fieldErrors).length
      ? 'Please correct the highlighted fields.'
      : friendlyBackendMessages[backendMessage] || backendMessage || statusMessages[status] || `Request failed (${status})`,
    fieldErrors,
    status,
  };
}

export async function request(config) {
  return unwrap(await http.request(config));
}
