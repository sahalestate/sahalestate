import { useState } from "react";
import "../styles/ListingDetailsPage.css";

const images = [
  "/images/home1.jpg",
  "/images/home2.jpg",
  "/images/home3.jpg",
  "/images/home4.jpg",
];

function ListingDetailsPage() {
  const [mainImage, setMainImage] = useState(images[0]);
  return (
    <>
      <section className="listing-details">
        <div className="container">
          <div className="details-grid">
            <div className="property-images">
              <img src={mainImage} alt="Property Main" className="main-image" />
              <div className="thumbnails">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`thumbnail${mainImage === img ? " active" : ""}`}
                    onClick={() => setMainImage(img)}
                    style={{
                      cursor: "pointer",
                      width: 80,
                      height: 60,
                      margin: 4,
                      borderRadius: 6,
                      border:
                        mainImage === img
                          ? "2px solid #04e762"
                          : "2px solid #eee",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="property-info-box">
              <h2 className="property-title">Modern Family Home</h2>
              <p className="property-location">
                📍 West Garden Street, Hargeisa
              </p>
              <p className="property-price">$250,000</p>
              <ul className="property-features">
                <li>🛏 4 Bedrooms</li>
                <li>🛁 3 Bathrooms</li>
                <li>🚗 2 Garage Spaces</li>
                <li>📐 2,400 sq ft</li>
              </ul>
              <p className="property-description">
                This modern family home offers spacious living with contemporary
                finishes throughout. Located in a quiet neighborhood, it's
                perfect for growing families or anyone looking for comfort and
                convenience.
              </p>
              <button className="contact-agent">Contact Agent</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ListingDetailsPage;
