import { useEffect, useState } from "react";
import countryService from "./services/node";

function App() {
  const [countryName, setCountryName] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const changeHandler = async (e) => {
    const searchQuery = e.target.value;
    setCountryName(searchQuery);

    try {
      const countries = await countryService.getAll();
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
      setSelectedCountry(null);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchCountryDetails = async (countryName) => {
    try {
      const details = await countryService.getCountryByName(countryName);
      setSelectedCountry(details);
    } catch (error) {
      console.error("Error fetching country details: ", error);
    }
  };

  useEffect(() => {
    if (filteredCountries.length === 1) {
      fetchCountryDetails(filteredCountries[0].name.common);
    }
  }, [filteredCountries]);

  const displayCountryDetails = () => {
    return (
    <div>
      <h1>{selectedCountry.name.common}</h1>
      <p>Capital: {selectedCountry.capital}</p>
      <p>Area: {selectedCountry.area}</p>
      <h1>Languages</h1>
      <ul>
        {Object.entries(selectedCountry.languages).map(([code, name]) => (
          <li key={code}>{name}</li>
        ))}
      </ul>
      <img
        src={selectedCountry.flags.png}
        alt={`Flag of ${selectedCountry.name.common}`}
      />
    </div>);
  };

  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    } else if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.name.common}>
              {country.name.common}{" "}
              <button onClick={() => fetchCountryDetails(country.name.common)}>
                show
              </button>
              {selectedCountry &&
                selectedCountry.name.common === country.name.common &&
                displayCountryDetails()}
            </li>
          ))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      return selectedCountry ? (
        displayCountryDetails()
      ) : (
        <div>Loading country details...</div>
      );
    }
    return null;
  };

  return (
    <>
      find countries <input onChange={changeHandler} value={countryName} />
      {renderCountries()}
    </>
  );
}

export default App;
