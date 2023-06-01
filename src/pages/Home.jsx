import { useEffect, useState } from "react";
import Nav from "./elements/Nav";
import WeeklyForecast from "./elements/WeeklyForecast";
import GlobalMap from "./elements/GlobalMap";
import RainForecast from "./elements/RainForecast";
import CitiesCards from "./elements/CitiesCards";

import axios from "axios";

import "../styles/home.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=_lat_&lon=_lon_&appid=${API_KEY}`;
const locationUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";

export default function Home() {
  const [city, setCity] = useState(null);
  const [citiesOptions, setCitiesOptions] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [savedCities, setSavedCities] = useState([]);
  const [theme, setTheme] = useState("dark");

  function handleCitySearch(citySearched) {
    if (citySearched.trim() === "") return false;
    console.log("handleCitySearch");
    axios
      .get(locationUrl + `?namePrefix=${citySearched}&sort=population`, {
        headers: {
          "x-rapidapi-key":
            "853c2f7e4cmshba1862047d27a1cp1a7f7fjsnb7acc43563a0",
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.data.length > 0) {
          setCitiesOptions(res.data.data.slice(0, 5));
        } else {
          setCitiesOptions([]);
        }
      });
  }
  useEffect(() => {
    setCitiesOptions(false);
    try {
      axios
        .get(
          weatherUrl
            .replace("_lat_", city.latitude)
            .replace("_lon_", city.longitude)
        )
        .then((res) => {
          setWeatherData(res.data);
          console.log(res.data);
        });
    } catch (e) {
      console.error(e);
    }
  }, [city]);

  useEffect(() => {
    if (localStorage.getItem("location")) {
      let locationSaved = localStorage.getItem("location");
      locationSaved = JSON.parse(locationSaved);
      setCity(locationSaved);
    } else if (navigator.geolocation && !city) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let latitude =
            position.coords.latitude > 0
              ? `+${position.coords.latitude}`
              : `-${position.coords.latitude}`;
          let longitude =
            position.coords.longitude > 0
              ? `+${position.coords.longitude}`
              : `-${position.coords.longitude}`;

          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          axios
            .get(locationUrl, {
              params: { location: latitude + longitude, sort: "population" },
              headers: {
                "x-rapidapi-key":
                  "853c2f7e4cmshba1862047d27a1cp1a7f7fjsnb7acc43563a0",
                "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
              },
            })
            .then((res) => {
              setCity(res.data.data[0]);
              localStorage.setItem(
                "location",
                JSON.stringify(res.data.data[0])
              );
            });
        },
        function (error) {
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    //getting locally saved cities

    let pastSavedCities = localStorage.getItem("saved-cities");
    if (pastSavedCities) {
      pastSavedCities = JSON.parse(pastSavedCities);
      setSavedCities(pastSavedCities);
    }
  }, []);

  function saveCity(city, pastSavedCities) {
    console.log("clicked");
    const newSavedCities = [...pastSavedCities];
    const idx = newSavedCities.findIndex(
      (ct) => city.city === ct.city && ct.country === city.country
    );
    if (idx === -1) {
      newSavedCities.push(city);
    } else {
      newSavedCities.splice(idx, 1);
    }

    setSavedCities(newSavedCities);
    localStorage.setItem("saved-cities", JSON.stringify(newSavedCities));
  }

  return (
    <div>
      <Nav
        handleCitySearch={handleCitySearch}
        citiesOptions={citiesOptions}
        setCitiesOptions={setCitiesOptions}
        setCity={setCity}
        city={city}
        saveCity={saveCity}
        savedCities={savedCities}
        theme={theme}
        setTheme={setTheme}
      />
      <div className="ele-grid">
        <div className="card-1">
          <WeeklyForecast weatherData={weatherData} />
        </div>
        <div className="card-2">
          <RainForecast weatherData={weatherData} />
        </div>
        <div className="card-3">
          <GlobalMap city={city} savedCities={savedCities} theme={theme} />
        </div>
        <div className="card-4">
          <CitiesCards
            savedCities={savedCities}
            setCity={setCity}
            setSavedCities={setSavedCities}
          />
        </div>
      </div>
    </div>
  );
}
