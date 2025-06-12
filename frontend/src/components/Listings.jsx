import { Link } from "react-router-dom";

function Listings({ listings }) {
  return (
    <div className="grid">
      {listings.map((listing) => (
        <div className="property-card" key={listing.id}>
          <Link to={`/listing/${listing.id}`}>
            <img
              src={
                listing.images && listing.images.length > 0
                  ? `/images/${listing.images[0]}` // Prepend the correct path for images
                  : "/images/default-image.jpg" // Use a default image if none are available
              }
              alt={listing.title}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <div className="property-info">
            <h3>{listing.title}</h3>
            <p>{listing.location}</p>
            <p className="property-price">${listing.price}</p>
            <ul className="property-features">
              <li>🛏 {listing.beds} Bedrooms</li>
              <li>🛁 {listing.baths} Bathrooms</li>
              <li>📐 {listing.area}</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Listings;
