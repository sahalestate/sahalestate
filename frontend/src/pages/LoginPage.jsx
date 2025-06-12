import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/index.css";
import "../styles/LoginPage.css"; // Specific styles for LoginPage

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
      } else {
        // Dispatch a custom login event after successful login
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role?.toLowerCase()); // Normalize role value before storing in localStorage
        localStorage.setItem("userId", data.userId); // Store userId in localStorage

        localStorage.setItem("userEmail", data.email); // Store userEmail in localStorage
        localStorage.setItem("fullName", data.fullName); // Store fullName in localStorage
        localStorage.setItem("name", data.name); // Store name in localStorage

        // Dispatch login event
        window.dispatchEvent(new Event("login"));

        navigate("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </>
  );
}

export default LoginPage;
