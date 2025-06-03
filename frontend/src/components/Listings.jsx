import { Link } from "react-router-dom";

function Listings({ listings }) {
  return (
    <div className="grid">
      {listings.map((listing) => (
        <div className="property-card" key={listing.id}>
          <Link to={`/listing/${listing.id}`}>
            <img
              src={listing.image}
              alt={listing.title}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <div className="property-info">
            <h3>{listing.title}</h3>
            <p>{listing.location}</p>
            <p className="property-price">{listing.price}</p>
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
