import { useEffect, useState } from "react";
import countryService from "./services/node";

function CountryDetails({ country, weather }) {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h1>Languages</h1>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => (
          <li key={code}>{name}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        style={{ width: "150px", marginTop: "1rem" }}
      />
      <h1>Weather in {country.capital}</h1>
      {weather ? (
        <div>
          <p>Description: {weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}

function App() {
  const [countryName, setCountryName] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);

  // Fetch all countries only once on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await countryService.getAll();
        setAllCountries(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const changeHandler = (e) => {
    const searchQuery = e.target.value;
    setCountryName(searchQuery);

    const filtered = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
    setSelectedCountry(null);
    setSelectedWeather(null);
  };

  const fetchCountryDetails = async (name) => {
    try {
      const details = await countryService.getCountryByName(name);
      setSelectedCountry(details);
    } catch (error) {
      console.error("Error fetching country details: ", error);
    }
  };

  const fetchWeatherData = async ([lat, lon]) => {
    try {
      const weather = await countryService.getWeather([lat, lon]);
      setSelectedWeather(weather);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  // Auto-fetch country details if only 1 match
  useEffect(() => {
    if (filteredCountries.length === 1) {
      fetchCountryDetails(filteredCountries[0].name.common);
    }
  }, [filteredCountries]);

  // Auto-fetch weather when selected country is set
  useEffect(() => {
    if (selectedCountry?.capitalInfo?.latlng) {
      fetchWeatherData(selectedCountry.capitalInfo.latlng);
    }
  }, [selectedCountry]);

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
            </li>
          ))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      return selectedCountry ? (
        <CountryDetails country={selectedCountry} weather={selectedWeather} />
      ) : (
        <p>Loading country details...</p>
      );
    }
    return null;
  };

  return (
    <div>
      <label>
        Find countries: <input onChange={changeHandler} value={countryName} />
      </label>
      {renderCountries()}
      {selectedCountry &&
        filteredCountries.length > 1 &&
        filteredCountries.some(
          (c) => c.name.common === selectedCountry.name.common
        ) && (
          <CountryDetails country={selectedCountry} weather={selectedWeather} />
        )}
    </div>
  );
}

export default App;
