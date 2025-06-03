import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-flex">
        <div className="footer-brand">
          <span className="footer-logo">🏠 RealEstate</span>
          <p>&copy; 2025 RealEstate. All rights reserved.</p>
        </div>
        <nav className="footer-links">
          <a href="/" aria-label="Home">
            Home
          </a>
          <a href="/listings" aria-label="Listings">
            Listings
          </a>
          <a href="/about" aria-label="About">
            About
          </a>
          <a href="/contact" aria-label="Contact">
            Contact
          </a>
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
