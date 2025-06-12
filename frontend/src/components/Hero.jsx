import "../styles/index.css";
import "../styles/hero.css"; // Specific styles for Hero
import SearchForm from "./SearchForm";

function Hero({
  title = "Find Your Dream Home",
  subtitle = "Discover the best properties in your area",
  onSearch,
  backendUrl,
  placeholder,
}) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <SearchForm
          onSearch={onSearch}
          backendUrl={backendUrl}
          placeholder={placeholder}
        />
      </div>
    </section>
  );
}

export default Hero;
