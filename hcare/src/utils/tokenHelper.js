import { v4 as uuidv4 } from "uuid";

/**
 * Generates a simple unique token (UUID v4).
 * Replace with JWT when integrating with real backend.
 */
export function generateToken() {
  return uuidv4();
}
