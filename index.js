import express from "express";
import crypto from "crypto";
import cors from "cors";
import moment from "moment-timezone";
import cryptoRandomString from "crypto-random-string";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to receive a secret from the client and generate a response
app.get("/create_sign", (req, res) => {
  const { apiKey, apiSecret } = req.body;

  if (!apiKey) {
    // If the client didn't provide a clientApiKey, respond with a 400 Bad Request status.
    return res.status(400).json({ error: "Client api key is missing." });
  }

  if (!apiSecret) {
    // If the client didn't provide a clientApiKSecret, respond with a 400 Bad Request status.
    return res.status(400).json({ error: "Client api secret is missing." });
  }

  // Generate a unique salt
  const salt = cryptoRandomString({ length: 64 });

  // Get the current datetime in ISO 8601 format
  const currentDateTime = moment(new Date())
    .tz("Asia/Seoul")
    .format("YYYY-MM-DD HH:mm:ss");

  // Generate the HMAC signature using the client's secret as the key
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(currentDateTime + salt)
    .digest("hex");

  // Prepare the response
  const response = {
    dateTime: currentDateTime,
    salt: salt,
    signature: signature,
  };

  // Send the response to the client with a 200 OK status.
  return res.status(200).json(response);
});

// Error handling middleware for handling unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
