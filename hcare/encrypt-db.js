const fs = require("fs");
const CryptoJS = require("crypto-js");

const SECRET = "healthcare_secret_key_123";

// Encrypt single object
function encrypt(obj) {
  return CryptoJS.AES.encrypt(JSON.stringify(obj), SECRET).toString();
}

// Decrypt old block format { data: "cipher" }
function decrypt(cipher) {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
  const text = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(text);
}

const DB_PATH = "db.json";
const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));

/**
 * Itha modules nu treat pannuvom
 * - users
 * - patients
 * - doctors
 * - ... etc
 *
 * NOTE:
 * 1) Already per-record format [{id, data}] na SKIP
 * 2) Plain array of objects na -> convert to [{id, data}]
 * 3) Old format { data: "encrypted" } na -> decrypt pannitu convert
 */
const modules = [
  "users",
  "patients",
  "appointments",
  "medicines",
  "staff",
  "doctors",
  "nurses",
  "pharmacists",
  "receptionists",
  "inventory",
  "billing",
  "communications",
  "notifications"
];

modules.forEach((mod) => {
  const value = db[mod];
  if (!value) return; // module illa na skip

  console.log(`\n🔍 Processing module: ${mod}`);

 // CASE 1: Already per-record encrypted => must have BOTH id & data
if (
  Array.isArray(value) &&
  value.length > 0 &&
  value[0].data &&
  value[0].id != null
) {
  console.log(`  ➜ ${mod} already per-record encrypted. Skipping.`);
  return;
}

  // ✅ CASE 2: Plain array of objects (no data field yet)
  if (Array.isArray(value)) {
    console.log(`  ➜ Detected plain array. Converting to encrypted records...`);
    items = value;
  }
  // ✅ CASE 3: Old style: { data: "encrypted_block" }
  else if (value && typeof value === "object" && typeof value.data === "string") {
    console.log(`  ➜ Detected old encrypted block. Decrypting...`);
    const decrypted = decrypt(value.data);

    if (Array.isArray(decrypted)) {
      items = decrypted;
    } else if (decrypted && typeof decrypted === "object") {
      items = [decrypted];
    } else {
      console.warn(`  ⚠ ${mod}: decrypted result not array/object. Skipping.`);
      return;
    }
  } else {
    console.warn(`  ⚠ ${mod}: unknown structure. Skipping.`);
    return;
  }

  // ✅ Final: convert to [{id, data}]
  db[mod] = items.map((item, index) => ({
    id: item.id != null ? item.id : index + 1,
    data: encrypt(item),
  }));

  console.log(`  ✅ ${mod} converted. Records: ${db[mod].length}`);
});

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log("\n✅ DATABASE CONVERSION COMPLETED (per-record encryption for all modules)");
