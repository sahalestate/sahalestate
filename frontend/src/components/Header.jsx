import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/index.css";
import "../styles/header.css"; // Specific styles for Header

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState(""); // Renamed from fullName to name
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    const storedName = localStorage.getItem("name") || "";
    setName(storedName); // Updated to use name
  }, []);

  useEffect(() => {
    const handleLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setName(localStorage.getItem("name") || ""); // Updated to use name
    };

    window.addEventListener("login", handleLogin);

    return () => {
      window.removeEventListener("login", handleLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("name"); // Updated to remove name
    setIsLoggedIn(false);
    setName("");
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <div className="logo">
          <img
            src="../../public/images/home.svg"
            alt="Home Logo"
            className="logo-icon"
          />
          <span className="logo-first-letter">S</span>ahal~Estate
        </div>
      </Link>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/listings">Listings</Link>
          </li>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <li>
                  <span className="user-greeting"> {name}</span>
                </li>
              </Link>

              <li>
                <button
                  className="dashboard-btn small secondary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
