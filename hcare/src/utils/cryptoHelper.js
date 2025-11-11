import CryptoJS from "crypto-js";

const SECRET = process.env.REACT_APP_SECRET_KEY || "healthcare_secret_key_123";

/**
 * Encrypts a JS object/string into AES ciphertext (string).
 * @param {any} data
 * @returns {string}
 */
export function encrypt(data) {
  try {
    const text = typeof data === "string" ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(text, SECRET).toString();
  } catch (e) {
    console.error("encrypt error:", e);
    return null;
  }
}

/**
 * Decrypts AES ciphertext into parsed object (if JSON) or string.
 * @param {string} cipher
 * @returns {any|null}
 */
export function decrypt(cipher) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    if (!plaintext) return null;
    try {
      return JSON.parse(plaintext);
    } catch {
      return plaintext;
    }
  } catch (e) {
    console.error("decrypt error:", e);
    return null;
  }
}
