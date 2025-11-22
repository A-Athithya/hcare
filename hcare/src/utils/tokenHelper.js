import { jwtDecode } from 'jwt-decode';
import { encrypt, decrypt } from './cryptoHelper';


/**
 * Generates a JWT token for the user.
 * @param {object} payload - User data to encode
 * @returns {string} JWT token
 */
function base64url(text) {
  const encoded = btoa(unescape(encodeURIComponent(text)));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function generateToken(payload) {
  const header = { alg: 'none', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 3600;  // Changed expiration to 1 hour (3600 seconds)
  const body = { ...payload, exp };
  const token = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}.${base64url('')}`;
  return token;
}

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    const decoded = jwtDecode(token);
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Stores the JWT token securely in localStorage (encrypted).
 * @param {string} token - JWT token
 */
export function storeToken(token) {
  const encryptedToken = encrypt(token);
  localStorage.setItem('authToken', encryptedToken);
}

/**
 * Retrieves and decrypts the JWT token from localStorage.
 * @returns {string|null} Decrypted token or null if not found
 */
export function getStoredToken() {
  const encryptedToken = localStorage.getItem('authToken');
  if (!encryptedToken) return null;
  return decrypt(encryptedToken);
}

/**
 * Removes the stored token from localStorage.
 */
export function removeStoredToken() {
  localStorage.removeItem('authToken');
}
