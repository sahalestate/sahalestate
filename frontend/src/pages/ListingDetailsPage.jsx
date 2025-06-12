import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/index.css";
import "../styles/ListingDetailsPage.css"; // Specific styles for ListingDetailsPage

function ListingDetailsPage() {
  const { id } = useParams(); // Extract listing ID from URL
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [listingDetails, setListingDetails] = useState(null); // State to store listing details
  const [userDetails, setUserDetails] = useState(null); // State to store user details

  useEffect(() => {
    async function fetchImages() {
      if (!id) return; // Wait until a valid listing ID is available
      try {
        const response = await fetch(
          `http://localhost:3000/api/listings/${id}/images` // Use dynamic listing ID from URL
        );
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        const fullImageUrls = data.map((filename) => `/images/${filename}`); // Construct full image URLs
        setImages(fullImageUrls);
        setMainImage(fullImageUrls[0]); // Set the first image as the main image
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }

    async function fetchListingDetails() {
      if (!id) return; // Wait until a valid listing ID is available
      try {
        const response = await fetch(
          `http://localhost:3000/api/listings/${id}` // Fetch listing details by ID
        );
        if (!response.ok) throw new Error("Failed to fetch listing details");
        const data = await response.json();
        setListingDetails(data); // Set listing details
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    }

    fetchImages();
    fetchListingDetails();
  }, [id]);

  useEffect(() => {
    async function fetchUserDetails(userId) {
      if (!userId) return; // Wait until a valid userId is available
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}` // Fetch user details by userId
        );
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUserDetails(data); // Set user details
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    if (listingDetails?.userId) {
      fetchUserDetails(listingDetails.userId); // Fetch user details when listingDetails is available
    }
  }, [id, listingDetails]);

  return (
    <>
      <section className="listing-details">
        <div className="container">
          <div className="details-grid">
            <div className="property-images">
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Property Main"
                  className="main-image"
                />
              )}
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
              {listingDetails ? (
                <>
                  <h2 className="property-title">{listingDetails.title}</h2>
                  <p className="property-location">
                    📍 {listingDetails.location}
                  </p>
                  <p className="property-price">${listingDetails.price}</p>
                  <ul className="property-features">
                    <li>🛏 {listingDetails.beds} Bedrooms</li>
                    <li>🛁 {listingDetails.baths} Bathrooms</li>
                    <li>📐 {listingDetails.area || "N/A"} sq ft</li>
                  </ul>
                  <p className="property-description">
                    {listingDetails.description}
                  </p>
                  {userDetails && (
                    <section className="property-user-details">
                      <h2 className="property-user-title">Agent Details</h2>
                      <p className="property-user">
                        Name: <strong>{userDetails.name}</strong>
                      </p>
                      <p className="property-user">
                        Address: <strong>{userDetails.address}</strong>
                      </p>
                      <p className="property-user">
                        Email: <strong>{userDetails.email}</strong>
                      </p>
                      <p className="property-user">
                        Phone: <strong>{userDetails.phone}</strong>
                      </p>
                    </section>
                  )}
                </>
              ) : (
                <p>Loading listing details...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ListingDetailsPage;
