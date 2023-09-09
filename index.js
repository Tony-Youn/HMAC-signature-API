const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint to receive a secret from the client and generate a response
app.post("/generate-response", (req, res) => {
  const clientSecret = req.body.secret;

  if (!clientSecret) {
    // If the client didn't provide a secret, respond with a 400 Bad Request status.
    return res.status(400).json({ error: "Client secret is missing." });
  }

  // Generate a unique salt
  const salt = generateRandomSalt();

  // Get the current datetime in ISO 8601 format
  const currentDateTime = new Date().toISOString();

  // Concatenate datetime and salt
  const dataToSign = currentDateTime + salt;

  // Generate the HMAC signature using the client's secret as the key
  const hmac = crypto.createHmac("sha256", clientSecret);
  hmac.update(dataToSign);
  const signature = hmac.digest("hex");

  // Prepare the response
  const response = {
    dateTime: currentDateTime,
    salt: salt,
    signature: signature,
  };

  // Send the response to the client with a 200 OK status.
  res.status(200).json(response);
});

function generateRandomSalt() {
  const saltLength = Math.floor(Math.random() * (64 - 12 + 1)) + 12;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let salt = "";
  for (let i = 0; i < saltLength; i++) {
    salt += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return salt;
}

// Error handling middleware for handling unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
