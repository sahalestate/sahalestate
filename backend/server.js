const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve listings data

app.get("/api/listings", (req, res) => {
  const userId = req.query.userId;
  const listingsPath = path.join(__dirname, "listings.json");

  fs.readFile(listingsPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read listings data" });
    }

    let listings = JSON.parse(data);

    // Only filter by userId if it exists
    if (userId) {
      listings = listings.filter((listing) => listing.userId === userId);
    }

    res.status(200).json(listings);
  });
});

// Serve user data
app.get("/api/users", (req, res) => {
  const usersPath = path.join(__dirname, "user.json");
  fs.readFile(usersPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read user data" });
    }
    res.json(JSON.parse(data));
  });
});

// Add user registration endpoint
app.post("/api/users", async (req, res) => {
  const usersPath = path.join(__dirname, "user.json");
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  fs.readFile(usersPath, "utf8", async (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read user data" });
    let users = JSON.parse(data);
    if (users.some((u) => u.email === email)) {
      return res.status(409).json({ error: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      name: username,
      email,
      password: hashedPassword,
      role: "user",
    };
    users.push(newUser);
    fs.writeFile(usersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save user." });
      res.status(201).json({ message: "Registration successful!" });
    });
  });
});

// Add login endpoint
app.post("/api/login", (req, res) => {
  const usersPath = path.join(__dirname, "user.json");
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  fs.readFile(usersPath, "utf8", async (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read user data" });
    let users = JSON.parse(data);
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({
      message: "Login successful!",
      userId: user.id, // Include userId in the response
      name: user.name,
      role: user.role,
    });
  });
});

// --- LISTINGS CRUD ENDPOINTS ---
app.post("/api/listings", (req, res) => {
  const userId = req.body.userId; // Assume userId is included in the request body
  const listingsPath = path.join(__dirname, "listings.json");
  const newListing = { ...req.body, id: Date.now(), userId }; // Add userId to the new listing
  fs.readFile(listingsPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read listings data" });
    }
    let listings = JSON.parse(data);
    listings.push(newListing);
    fs.writeFile(listingsPath, JSON.stringify(listings, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save listing" });
      }
      res
        .status(201)
        .json({ message: "Listing added successfully", listing: newListing });
    });
  });
});

app.put("/api/listings/:id", (req, res) => {
  const listingsPath = path.join(__dirname, "listings.json");
  const id = parseInt(req.params.id);
  fs.readFile(listingsPath, "utf8", (err, data) => {
    if (err)
      return res.status(500).json({ error: "Failed to read listings data" });
    let listings = JSON.parse(data);
    const idx = listings.findIndex((l) => l.id === id);
    if (idx === -1) return res.status(404).json({ error: "Listing not found" });
    listings[idx] = { ...listings[idx], ...req.body, id };
    fs.writeFile(listingsPath, JSON.stringify(listings, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to update listing." });
      res.json(listings[idx]);
    });
  });
});

app.delete("/api/listings/:id", (req, res) => {
  const listingsPath = path.join(__dirname, "listings.json");
  const id = parseInt(req.params.id);
  fs.readFile(listingsPath, "utf8", (err, data) => {
    if (err)
      return res.status(500).json({ error: "Failed to read listings data" });
    let listings = JSON.parse(data);
    const idx = listings.findIndex((l) => l.id === id);
    if (idx === -1) return res.status(404).json({ error: "Listing not found" });
    const deleted = listings.splice(idx, 1)[0];
    fs.writeFile(listingsPath, JSON.stringify(listings, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to delete listing." });
      res.json(deleted);
    });
  });
});

// --- USERS CRUD ENDPOINTS ---
app.put("/api/users/:id", async (req, res) => {
  const usersPath = path.join(__dirname, "user.json");
  const id = parseInt(req.params.id);
  fs.readFile(usersPath, "utf8", async (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read user data" });
    let users = JSON.parse(data);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return res.status(404).json({ error: "User not found" });
    let updatedUser = { ...users[idx], ...req.body, id };
    if (req.body.password) {
      updatedUser.password = await bcrypt.hash(req.body.password, 10);
    }
    users[idx] = updatedUser;
    fs.writeFile(usersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to update user." });
      res.json(users[idx]);
    });
  });
});

app.delete("/api/users/:id", (req, res) => {
  const usersPath = path.join(__dirname, "user.json");
  const id = parseInt(req.params.id);
  fs.readFile(usersPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read user data" });
    let users = JSON.parse(data);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return res.status(404).json({ error: "User not found" });
    const deleted = users.splice(idx, 1)[0];
    fs.writeFile(usersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete user." });
      res.json(deleted);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
