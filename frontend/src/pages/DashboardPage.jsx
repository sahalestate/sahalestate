import SearchForm from "../components/SearchForm";
import "../styles/index.css";
import "../styles/DashboardPage.css"; // Specific styles for DashboardPage

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
    images: [],
    beds: "",
    baths: "",
    area: "",
    description: "", // Added description field
  });
  // User CRUD state
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    role: "",
    address: "",
  });
  const [filteredListings, setFilteredListings] = useState([]);
  const [listingConfirmationMessage, setListingConfirmationMessage] =
    useState("");
  const [userConfirmationMessage, setUserConfirmationMessage] = useState("");
  const [deleteConfirmationMessage, setDeleteConfirmationMessage] =
    useState("");

  // Check if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole"); // Assume userRole is stored in localStorage
    setIsAdmin(userRole === "admin");
    setWaitingApproval(userRole === "user"); // Track 'user' role
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
    const { name, value, files } = e.target;
    if (name === "images") {
      // Handle multiple image files
      setListingForm({
        ...listingForm,
        images: Array.from(files).map((file) => file.name), // Store file names for simplicity
      });
    } else {
      setListingForm({ ...listingForm, [name]: value });
    }
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
    if (
      !listingForm.title ||
      !listingForm.location ||
      !listingForm.price ||
      !listingForm.images.length ||
      !listingForm.beds ||
      !listingForm.baths ||
      !listingForm.description // Ensure description is provided
    ) {
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
      setListings((prevListings) => [...prevListings, newListing.listing]); // Update state immediately
      setFilteredListings((prevListings) => [
        ...prevListings,
        newListing.listing,
      ]);
      setListingForm({
        title: "",
        location: "",
        price: "",
        images: [],
        beds: "",
        baths: "",
        area: "",
        description: "", // Reset description field
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
      images: listing.images,
      beds: listing.beds,
      baths: listing.baths,
      area: listing.area,
      description: listing.description, // Populate description for editing
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
        images: [],
        beds: "",
        baths: "",
        area: "",
        description: "", // Reset description field
      });
      setListingConfirmationMessage("Listing updated successfully!");
    } catch (err) {
      setListingConfirmationMessage("Error updating listing: " + err.message);
    }
  };
  const [deletePendingId, setDeletePendingId] = useState(null); // Track which listing is pending deletion
  const handleDeleteListing = (id) => {
    setDeletePendingId(id); // Set the ID of the listing to delete
  };

  const handleConfirmDeleteListing = async () => {
    if (!deletePendingId) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/listings/${deletePendingId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete listing");
      setListings(await res.json());
      setDeleteConfirmationMessage("Listing deleted successfully!");
    } catch (err) {
      setDeleteConfirmationMessage("Error deleting listing: " + err.message);
    } finally {
      setDeletePendingId(null); // Reset the pending ID
    }
  };

  const handleCancelDeleteListing = () => {
    setDeletePendingId(null); // Cancel the delete action
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
      name: user.name || "", // Fallback to empty string if undefined
      role: user.role || "", // Fallback to empty string if undefined
      address: user.address || "", // Fallback to empty string if undefined
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
          body: JSON.stringify({
            name: userForm.name,
            role: userForm.role,
            address: userForm.address,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update user");
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setEditingUser(null);
      setUserForm({
        name: "",
        role: "",
        address: "",
      });
      setUserConfirmationMessage("User updated successfully!");
    } catch (error) {
      setUserConfirmationMessage("Error updating user: " + error.message);
    }
  };
  const [deletePendingUserId, setDeletePendingUserId] = useState(null);

  const handleDeleteUser = (userId) => {
    setDeletePendingUserId(userId); // Set the user ID for pending deletion
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${deletePendingUserId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deletePendingUserId)
      );
      setSuccessMessage("User deleted successfully!"); // Inline success message
    } catch (error) {
      setErrorMessage("Error deleting user: " + error.message); // Inline error message
    } finally {
      setDeletePendingUserId(null); // Reset the pending user ID
    }
  };

  const cancelDeleteUser = () => {
    setDeletePendingUserId(null); // Cancel the delete action
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
      {waitingApproval ? (
        <div className="waiting-approval-message">
          Waiting for approval. Please check back later or contact admin.
        </div>
      ) : (
        <div className="dashboard-container">
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
              className={`dashboard-link${
                activeTab === "user" ? " active" : ""
              }`}
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
                    name="images"
                    type="file"
                    onChange={handleListingChange}
                    placeholder="Images"
                    className="dashboard-input"
                    multiple
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
                  <textarea
                    name="description"
                    value={listingForm.description || ""}
                    onChange={handleListingChange}
                    placeholder="Enter description"
                    required
                    className="dashboard-textarea description-field"
                  ></textarea>
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
                          images: [],
                          beds: "",
                          baths: "",
                          area: "",
                          description: "", // Reset description field
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>

                {/* confirmation message */}
                {listingConfirmationMessage && (
                  <div className="confirmation-message">
                    {listingConfirmationMessage}
                  </div>
                )}

                {userConfirmationMessage && (
                  <div className="confirmation-message">
                    {userConfirmationMessage}
                  </div>
                )}
                {deletePendingId && (
                  <div className="delete-confirmation">
                    <p>Are you sure you want to delete this listing?</p>
                    <button onClick={handleConfirmDeleteListing}>Yes</button>
                    <button onClick={handleCancelDeleteListing}>No</button>
                  </div>
                )}

                <ul>
                  {filteredListings.map((listing) => (
                    <li key={listing.id} className="listing-item">
                      <span className="id">{listing.id}</span>

                      <span className="title">{listing.title}</span>
                      <span className="location">{listing.location}</span>
                      {/* <span className="price">{listing.price}</span>
                      <span className="images">
                        {(listing.images || []).join(", ")}
                      </span>
                      <span className="beds">{listing.beds}</span>
                      <span className="baths">{listing.baths}</span>
                      <span className="area">{listing.area}</span> */}
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
                  className="user-form"
                  style={{ marginBottom: 16 }}
                >
                  <input
                    name="name"
                    value={userForm.name}
                    onChange={handleUserChange}
                    placeholder="Name"
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
                    <option value="agent">Agent</option>
                    <option value="user">User</option>
                  </select>
                  <input
                    name="address"
                    value={userForm.address}
                    onChange={handleUserChange}
                    placeholder="Address"
                    className="dashboard-input"
                  />
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
                          address: "",
                          phone: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
                {deletePendingUserId && (
                  <div className="confirmation-message">
                    <p>Are you sure you want to delete this user?</p>
                    <button onClick={confirmDeleteUser}>Yes</button>
                    <button onClick={cancelDeleteUser}>No</button>
                  </div>
                )}
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
      )}
    </>
  );
}

export default DashboardPage;
