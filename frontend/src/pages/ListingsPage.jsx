import Listings from "../components/Listings";
import Hero from "../components/Hero";
import Pagination from "../components/Pagination";
import { useState, useEffect } from "react";
import "../styles/index.css";
import "../styles/ListingsPage.css"; // Specific styles for ListingsPage
import "../styles/Pagination.css"; // Specific styles for Pagination

function ListingsPage() {
  const [filteredListings, setFilteredListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 8;

  useEffect(() => {
    fetch("http://localhost:3000/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setAllListings(data);
        setFilteredListings(data);
      });
  }, []);

  // Use backend-powered search
  const handleBackendSearch = (dataOrQuery) => {
    setCurrentPage(1);
    if (Array.isArray(dataOrQuery)) {
      setFilteredListings(dataOrQuery);
    } else if (typeof dataOrQuery === "string") {
      // fallback: filter allListings, not a previously filtered set
      setFilteredListings(
        allListings.filter(
          (l) =>
            (l.title &&
              l.title.toLowerCase().includes(dataOrQuery.toLowerCase())) ||
            (l.location &&
              l.location.toLowerCase().includes(dataOrQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredListings(allListings);
    }
  };

  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  return (
    <>
      <Hero
        title="Browse All Listings"
        subtitle="Search and explore our full property catalog"
        onSearch={handleBackendSearch}
        backendUrl="http://localhost:3000/api/listings"
        placeholder="Search by city, ZIP, or keyword"
      />
      <Listings listings={paginatedListings} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}

export default ListingsPage;
