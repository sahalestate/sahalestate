import "../styles/index.css";
import "../styles/footer.css"; // Specific styles for Footer
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-flex">
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
        <div className="footer-social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
          >
            <img src="/SVG/facebook.svg" alt="Facebook" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            aria-label="Twitter"
          >
            <img src="/SVG/twitter.svg" alt="Twitter" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <img src="/SVG/instagram.svg" alt="Instagram" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
          >
            <img src="/SVG/linkedin.svg" alt="LinkedIn" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
