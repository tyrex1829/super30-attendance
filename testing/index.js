const express = require("express");
const CryptoJS = require("crypto-js");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let aesKey = null;
let iv = null;
let storedData = null;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.post("/store-local-storage", (req, res) => {
  const localStorageData = req.body.data; // Access the sent data

  if (localStorageData) {
    console.log("Received localStorage data:", localStorageData);

    const aesData = localStorageData.encryptorAES.split("&");
    if (aesData.length === 2) {
      aesKey = String(aesData[0].split("=")[1]); // Extracts the key (k)
      iv = String(aesData[1].split("=")[1]); // Extracts the IV (i
      console.log(aesKey);
      console.log(iv);

      return res.status(200).json({ message: "Data stored successfully" });
    } else {
      return res.status(400).json({ message: "Invalid AES data format" });
    }
  } else {
    res.status(400).send({ message: "No data received" });
  }
});

app.post("/decrypt", (req, res) => {
  const encryptedData = req.body.encryptedData;

  if (!encryptedData) {
    return res.status(400).json({ error: "No encrypted data provided" });
  }

  if (!aesKey || !iv) {
    return res.status(400).json({ error: "AES key or IV not set" });
  }

  try {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(aesKey),
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const plaintext = decryptedData.toString(CryptoJS.enc.Utf8);

    if (!plaintext) {
      return res.status(500).json({ error: "Decryption failed" });
    }

    storedData = JSON.parse(plaintext);

    res.json({ decryptedData: storedData });
  } catch (error) {
    console.error("Error decrypting data:", error);
    res.status(500).json({ error: "Error decrypting data" });
  }
});

app.get("/data", (req, res) => {
  if (!storedData) {
    return res.status(404).json({ error: "No decrypted data available" });
  }

  res.json(storedData);
});

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
