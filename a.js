import crypto from "crypto";

function decryptAES(encryptedData, aesKey, iv) {
  const decipher = crypto.createDecipheriv("aes-128-cbc", aesKey, iv);
  let decrypted = decipher.update(encryptedData, "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

// Example usage
const aesKey = Buffer.from("7344603280678819", "utf-8"); // Use the AES key
const iv = Buffer.from("1846325099568942", "utf-8"); // Use the AES IV
const encryptedData =
  "Zye/j4ztEW6CuXZSwOPEw5wtK0k7RrNBE8oVO+j92OZk//7NUaxZ3s+0HU80QwxqcfNS2fsmwFFAcAdz7vqETGFoK4dOhOBFCnf32e6UuJ8W+SfCj0Ph3pfO/ZYKvsmtsCWKbRsyFUfCXxncvyFjTw5qILKETyxssXuxlXyu8N8="; // Encrypted data

try {
  const decryptedData = decryptAES(encryptedData, aesKey, iv);
  console.log("Decrypted Data:", decryptedData);
} catch (error) {
  console.error("Decryption failed:", error.message);
}
