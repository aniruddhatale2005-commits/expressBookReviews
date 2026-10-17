
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
  })
);

// Verify JWT for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.get("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "Authorization token is required"
    });
  }

  try {
    const decoded = jwt.verify(token, "bookreview_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
