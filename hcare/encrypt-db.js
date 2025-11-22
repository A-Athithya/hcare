const fs = require("fs");
const CryptoJS = require("crypto-js");

const SECRET = "healthcare_secret_key_123";

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
}

function decrypt(data) {
  const bytes = CryptoJS.AES.decrypt(data, SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const db = JSON.parse(fs.readFileSync("db.json", "utf8"));

const modules = [
  "patients",
  "appointments",
  "medicines",
  "staff",
  "doctors",
  "nurses",
  "pharmacists",
  "receptionists",
  "inventory"
];

modules.forEach((module) => {
  if (!db[module]) return;

  // OLD FORMAT CHECK
  if (db[module].data) {

    console.log(`🔄 Converting ${module}...`);

    const decryptedArray = decrypt(db[module].data);

    db[module] = decryptedArray.map(item => ({
      id: item.id,
      data: encrypt(item)
    }));

  }
});

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
console.log("✅ ALL modules converted to per-record encryption format");
