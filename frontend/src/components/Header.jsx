import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Header.css"; // Adjust the path as necessary

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setUserName(localStorage.getItem("userName") || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
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
                  <span className="user-greeting"> {userName}</span>
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
