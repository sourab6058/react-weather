import { useEffect, useRef, useState } from "react";
import axios from "axios";

import "../../styles/citiesCards.css";
import { icons } from "./util";
import { Delete } from "@mui/icons-material";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=_lat_&lon=_lon_&appid=${API_KEY}`;

export default function CitiesCards({ savedCities, setCity, setSavedCities }) {
  const [activateDelete, setActivateDelete] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const finalDeletBtnRef = useRef(null);
  function addToDeleteList(city, deleteListPassed) {
    const newDeleteList = [...deleteListPassed];
    const idx = newDeleteList.findIndex(
      (ct) => ct.city === city.city && ct.country === city.country
    );
    if (idx === -1) {
      newDeleteList.push(city);
    } else {
      newDeleteList.splice(idx, 1);
    }
    setDeleteList(newDeleteList);
  }

  function startDeleteProcess(prevActivateDelete) {
    if (!prevActivateDelete) {
      finalDeletBtnRef.current.style.width = "120px";
      finalDeletBtnRef.current.style.height = "auto";
    } else {
      finalDeletBtnRef.current.style.width = "0";
      finalDeletBtnRef.current.style.height = "0";
    }
    setActivateDelete(!prevActivateDelete);
  }

  function deleteSelected(deleteList, savedCities) {
    let newSavedCities = [...savedCities];
    newSavedCities = newSavedCities.filter(
      (ct) =>
        deleteList.findIndex(
          (dct) => dct.city !== ct.city || dct.country !== ct.country
        ) !== -1
    );
    setSavedCities(newSavedCities);
  }

  return (
    <div>
      <div className="saved-header">
        <span>Saved Cities</span>
        <div
          className={`delete-btn ${activateDelete ? "active-delete-btn" : ""}`}
          onClick={() => startDeleteProcess(activateDelete)}
        >
          <div
            className="final-delete"
            ref={finalDeletBtnRef}
            onClick={() => deleteSelected(deleteList, savedCities)}
          >
            Delete Selected
          </div>
          <Delete />
        </div>
      </div>
      <div className="cards-container">
        {savedCities.map((city) => (
          <CityCard
            city={city}
            setCity={setCity}
            activateDelete={activateDelete}
            addToDeleteList={addToDeleteList}
            deleteList={deleteList}
          />
        ))}
      </div>
    </div>
  );
}

function CityCard({
  city,
  setCity,
  activateDelete,
  addToDeleteList,
  deleteList,
}) {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    try {
      axios
        .get(
          weatherUrl
            .replace("_lat_", city.latitude)
            .replace("_lon_", city.longitude)
        )
        .then((res) => {
          console.log(res.data);
          setWeather(res.data);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <div
      className={`city-card ${activateDelete ? "active-border" : ""} ${
        deleteList.find(
          (ct) => ct.city === city.city && ct.country === city.country
        )
          ? "red-border"
          : ""
      }`}
      onClick={
        activateDelete
          ? () => addToDeleteList(city, deleteList)
          : () => setCity(city)
      }
    >
      <div className="left-card card-content">
        <span>{city.country}</span>
        <span>{city.city}</span>
        <span>{weather?.weather[0].description}</span>
      </div>
      <div className="right-card card-content">
        <div className="img-cntr">
          <img src={icons[weather?.weather[0].icon]}></img>
        </div>
        <span>
          {weather ? Math.round(weather.main.temp - 273.15) : "..."}{" "}
          <sup>°c</sup>{" "}
        </span>
      </div>
    </div>
  );
}
