import Listings from "../components/Listings";
import Hero from "../components/Hero";
import "../styles/index.css";

import { useState, useEffect } from "react";

function HomePage() {
  const [filteredListings, setFilteredListings] = useState([]);
  const [allListings, setAllListings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/listings")
      .then((res) => res.json())
      .then((data) => {
        const validData = Array.isArray(data) ? data : [];
        setAllListings(validData);
        setFilteredListings(validData);
      })
      .catch(() => {
        setAllListings([]);
        setFilteredListings([]);
      });
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredListings(allListings);
      return;
    }
    setFilteredListings(
      allListings.filter(
        (l) =>
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.location.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <Listings listings={filteredListings} />

      <section className="about">
        <div className="container">
          <h2>About Us</h2>
          <p>
            We are a top-rated real estate agency helping families find homes
            since 2005. Our mission is to make your home buying experience
            seamless and satisfying.
          </p>
        </div>
      </section>

      <section className="why-us">
        <div className="container">
          <h2>Why Choose Us</h2>
          <ul className="features">
            <li>✔ Verified Listings</li>
            <li>✔ 24/7 Customer Support</li>
            <li>✔ Expert Agents</li>
            <li>✔ Easy Documentation</li>
          </ul>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial">
              <p>“Amazing service! Found our dream home within a week.”</p>
              <span>– Sarah M.</span>
            </div>
            <div className="testimonial">
              <p>
                “The agents were professional and helped us through every step.”
              </p>
              <span>– James L.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
