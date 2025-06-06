import SearchForm from "../components/SearchForm";
import "../styles/DashboardPage.css";
import { useState, useEffect } from "react";

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("listings");
  // Listings CRUD state
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [listingForm, setListingForm] = useState({
    title: "",
    location: "",
    price: "",
    image: "",
    beds: "",
    baths: "",
    area: "",
  });
  // User CRUD state
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [filteredListings, setFilteredListings] = useState([]);
  const [listingConfirmationMessage, setListingConfirmationMessage] =
    useState("");
  const [userConfirmationMessage, setUserConfirmationMessage] = useState("");

  // Check if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const userRole = localStorage.getItem("userRole"); // Assume userRole is stored in localStorage
    setIsAdmin(userRole === "admin");
  }, []);

  // Fetch listings and users from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage
        const listingsRes = await fetch(
          `http://localhost:3000/api/listings?userId=${userId}`
        );
        if (!listingsRes.ok) throw new Error("Failed to fetch listings");
        const listingsData = await listingsRes.json();
        setListings(listingsData);
        setFilteredListings(listingsData);
      } catch (err) {
        alert("Error loading listings: " + err.message);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredListings(Array.isArray(listings) ? listings : []);
  }, [listings]);

  // Fetch users from backend
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const usersData = await response.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Error loading users:", err);
        setUsers([]); // Fallback to empty array
      }
    }
    fetchUsers();
  }, []);

  // Debugging logs
  useEffect(() => {}, [users]);

  // Updated admin check logic to use backend data
  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const usersData = await response.json();

        const userEmail = localStorage.getItem("userEmail");

        const currentUser = usersData.find(
          (user) => user.email.toLowerCase() === userEmail?.toLowerCase()
        );

        if (currentUser) {
          setIsAdmin(currentUser.role?.toLowerCase() === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    }

    checkAdminAccess();
  }, []);

  // Listings CRUD handlers
  const handleListingChange = (e) => {
    setListingForm({ ...listingForm, [e.target.name]: e.target.value });
  };
  const handleAddListing = async (e) => {
    e.preventDefault();
    let userId = localStorage.getItem("userId");
    if (!userId) {
      setListingConfirmationMessage(
        "Error: User ID is missing. Please log in again."
      );
      return;
    }
    if (!listingForm.title || !listingForm.location || !listingForm.price) {
      setListingConfirmationMessage("All fields are required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...listingForm, userId }),
      });
      if (!response.ok) throw new Error("Failed to add listing");
      const newListing = await response.json();
      setListings((prevListings) => [...prevListings, newListing.listing]);
      setFilteredListings((prevListings) => [
        ...prevListings,
        newListing.listing,
      ]);
      setListingForm({
        title: "",
        location: "",
        price: "",
        image: "",
        beds: "",
        baths: "",
        area: "",
      });
      setListingConfirmationMessage("Listing added successfully!");
    } catch (error) {
      setListingConfirmationMessage("Error adding listing: " + error.message);
    }
  };
  const handleEditListing = (listing) => {
    setEditingListing(listing.id);
    setListingForm({
      title: listing.title,
      location: listing.location,
      price: listing.price,
      image: listing.image,
      beds: listing.beds,
      baths: listing.baths,
      area: listing.area,
    });
  };
  const handleUpdateListing = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/listings/${editingListing}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listingForm),
        }
      );
      if (!res.ok) throw new Error("Failed to update listing");
      setListings(await res.json());
      setEditingListing(null);
      setListingForm({
        title: "",
        location: "",
        price: "",
        image: "",
        beds: "",
        baths: "",
        area: "",
      });
      setListingConfirmationMessage("Listing updated successfully!");
    } catch (err) {
      setListingConfirmationMessage("Error updating listing: " + err.message);
    }
  };
  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      const res = await fetch(`http://localhost:3000/api/listings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete listing");
      setListings(await res.json());
    } catch (err) {
      alert("Error deleting listing: " + err.message);
    }
  };

  // User CRUD handlers
  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (
      !userForm.name ||
      !userForm.email ||
      !userForm.password ||
      !userForm.role
    ) {
      setUserConfirmationMessage("All fields are required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      if (!response.ok) throw new Error("Failed to add user");
      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setUserForm({ name: "", email: "", password: "", role: "" });
      setUserConfirmationMessage("User added successfully!");
    } catch (error) {
      setUserConfirmationMessage("Error adding user: " + error.message);
    }
  };
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "", // Password should not be pre-filled for security reasons
      role: user.role,
    });
  };
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${editingUser}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userForm),
        }
      );
      if (!response.ok) throw new Error("Failed to update user");
      const updatedUsers = await response.json();
      setUsers(Array.isArray(updatedUsers) ? updatedUsers : []);
      setEditingUser(null);
      setUserForm({ name: "", email: "", password: "", role: "" });
      setUserConfirmationMessage("User updated successfully!");
    } catch (error) {
      setUserConfirmationMessage("Error updating user: " + error.message);
    }
  };
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      alert("Error deleting user: " + error.message);
    }
  };

  const handleSearch = (query) => {
    const userId = "12345"; // Replace with actual logged-in user ID
    const lowerCaseQuery = query.toLowerCase();
    const filtered = listings.filter(
      (listing) =>
        listing.userId === userId &&
        (listing.title.toLowerCase().includes(lowerCaseQuery) ||
          listing.location.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredListings(filtered);
  };
  0;
  return (
    <>
      <div className="dashboard-container">
        {/* Display confirmation message at the top */}
        {listingConfirmationMessage && (
          <div className="confirmation-message" style={{ marginTop: "8px" }}>
            {listingConfirmationMessage}
          </div>
        )}
        {userConfirmationMessage && (
          <div className="confirmation-message" style={{ marginTop: "8px" }}>
            {userConfirmationMessage}
          </div>
        )}

        {/* Navigation links */}
        <div className="dashboard-nav">
          <button
            className={`dashboard-link${
              activeTab === "listings" ? " active" : ""
            }`}
            onClick={() => setActiveTab("listings")}
            type="button"
          >
            Listings
          </button>
          <button
            className={`dashboard-link${activeTab === "user" ? " active" : ""}`}
            onClick={() => setActiveTab("user")}
            type="button"
          >
            User
          </button>
        </div>
        <div className="dashboard-content">
          {activeTab === "listings" && (
            <section className="dashboard-section">
              <div className="dashboard-section-title">Listings</div>
              <SearchForm onSearch={handleSearch} />
              <form
                onSubmit={
                  editingListing ? handleUpdateListing : handleAddListing
                }
              >
                <input
                  name="title"
                  value={listingForm.title}
                  onChange={handleListingChange}
                  placeholder="Title"
                  className="dashboard-input"
                />
                <input
                  name="location"
                  value={listingForm.location}
                  onChange={handleListingChange}
                  placeholder="Location"
                  className="dashboard-input"
                />
                <input
                  name="price"
                  value={listingForm.price}
                  onChange={handleListingChange}
                  placeholder="Price"
                  type="text"
                  className="dashboard-input"
                />
                <input
                  name="image"
                  value={listingForm.image}
                  onChange={handleListingChange}
                  placeholder="Image URL"
                  className="dashboard-input"
                />
                <input
                  name="beds"
                  value={listingForm.beds}
                  onChange={handleListingChange}
                  placeholder="Beds"
                  type="number"
                  className="dashboard-input"
                />
                <input
                  name="baths"
                  value={listingForm.baths}
                  onChange={handleListingChange}
                  placeholder="Baths"
                  type="number"
                  className="dashboard-input"
                />
                <input
                  name="area"
                  value={listingForm.area}
                  onChange={handleListingChange}
                  placeholder="Area (e.g. 1200 sq ft)"
                  className="dashboard-input"
                />
                <button type="submit" className="dashboard-link">
                  {editingListing ? "Update" : "Add"}
                </button>
                {editingListing && (
                  <button
                    type="button"
                    className="dashboard-link cancel"
                    onClick={() => {
                      setEditingListing(null);
                      setListingForm({
                        title: "",
                        location: "",
                        price: "",
                        image: "",
                        beds: "",
                        baths: "",
                        area: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
              {/* ###### */}
              {listingConfirmationMessage && (
                <div
                  className="confirmation-message"
                  style={{ marginTop: "8px" }}
                >
                  {listingConfirmationMessage}
                </div>
              )}

              {/* #### */}

              <ul>
                {filteredListings.map((listing) => (
                  <li key={listing.id}>
                    <span style={{ flex: 2, fontWeight: 600 }}>
                      {listing.title}
                    </span>
                    <span style={{ flex: 2 }}>{listing.location}</span>
                    <span style={{ flex: 1 }}>{listing.price}</span>
                    <span style={{ flex: 2 }}>{listing.image}</span>
                    <span style={{ flex: 1 }}>{listing.beds}</span>
                    <span style={{ flex: 1 }}>{listing.baths}</span>
                    <span style={{ flex: 1 }}>{listing.area}</span>
                    <button
                      className="dashboard-link"
                      onClick={() => handleEditListing(listing)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="dashboard-link delete"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {activeTab === "user" && isAdmin && (
            <section className="dashboard-section">
              <div className="dashboard-section-title">Users</div>
              <form
                onSubmit={editingUser ? handleUpdateUser : handleAddUser}
                style={{ marginBottom: 16 }}
              >
                <input
                  name="name"
                  value={userForm.name}
                  onChange={handleUserChange}
                  placeholder="Name"
                  className="dashboard-input"
                />
                <input
                  name="email"
                  value={userForm.email}
                  onChange={handleUserChange}
                  placeholder="Email"
                  className="dashboard-input"
                />
                <input
                  name="password"
                  value={userForm.password}
                  onChange={handleUserChange}
                  placeholder="Password"
                  type="password"
                  className="dashboard-input"
                />
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserChange}
                  className="dashboard-input"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <button type="submit" className="dashboard-link">
                  {editingUser ? "Update" : "Add"} User
                </button>
                {editingUser && (
                  <button
                    type="button"
                    className="dashboard-link cancel"
                    onClick={() => {
                      setEditingUser(null);
                      setUserForm({
                        name: "",
                        email: "",
                        password: "",
                        role: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <button
                      className="dashboard-link"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="dashboard-link delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!isAdmin && activeTab === "user" && (
            <div className="dashboard-section-title">
              Access Denied: Admins Only
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
