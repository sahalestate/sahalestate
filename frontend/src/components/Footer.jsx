import "../styles/index.css";
import "../styles/footer.css"; // Specific styles for Footer
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="footer-logo">🏠 RealEstate</span>
        <p>&copy; 2025 RealEstate. All rights reserved.</p>
      </div>
      <nav className="footer-links">
        <Link to="/" aria-label="Home">
          Home
        </Link>
        <Link to="/listings" aria-label="Listings">
          Listings
        </Link>
        <Link to="/contact" aria-label="Contact">
          Contact
        </Link>
      </nav>
      <div className="footer-contact">
        <p>
          <strong>Contact:</strong>
        </p>
        <p>
          Email: <a href="mailto:info@realestate.com">info@realestate.com</a>
        </p>
        <p>
          Phone: <a href="tel:+252123456789">+252 123 456 789</a>
        </p>
        <p>Address: 123 Main St, Hargeisa, Somaliland</p>
      </div>
    </footer>
  );
}

export default Footer;
