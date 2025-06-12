import { useState, useEffect } from "react";
import "../styles/index.css";
import "../styles/RegisterPage.css"; // Specific styles for RegisterPage

function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.address ||
      !form.phone
    ) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!/^\d{11}$/.test(form.phone)) {
      setError("Phone number must be exactly 11 digits.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          address: form.address,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        setSuccess("Registration successful! You can now log in.");
        setForm({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          address: "",
          phone: "",
        });
        if (data.fullName) {
          localStorage.setItem("fullName", data.fullName); // Store fullName in localStorage
        }
        localStorage.setItem("name", data.name); // Store name in localStorage
        // Optionally, refresh users list
        fetch("http://localhost:3000/api/users")
          .then((res) => res.json())
          .then((data) => setUsers(data));
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={(e) => {
                if (e.target.value.length <= 11) {
                  handleChange(e);
                }
              }}
              placeholder="Enter your phone number (11 digits)"
              pattern="\d{11}"
              required
            />
          </div>
          <button type="submit">Register</button>
          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}
        </form>
      </div>
    </>
  );
}

export default RegisterPage;
