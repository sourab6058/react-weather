import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { icons } from "../elements/util";
import "../../styles/globalmap.css";
import axios from "axios";
import { AutoAwesome } from "@mui/icons-material";

const MAP_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=_lat_&lon=_lon_&appid=${API_KEY}`;

export default function GlobalMap({ city, savedCities, theme }) {
  const mapRef = useRef(null);
  useEffect(() => {
    mapboxgl.accessToken = MAP_API_KEY;
    console.log(savedCities);
    if (city !== null) {
      console.log("worling");
      const map = new mapboxgl.Map({
        container: "map",
        style: `mapbox://styles/mapbox/${
          theme === "dark" ? "dark-v10" : "light-v10"
        }`,
        center: [city.longitude, city.latitude],
        zoom: 2,
      });

      map.on("click", (event) => {
        console.log(event);
      });

      [...savedCities, city].forEach((place) => {
        try {
          axios
            .get(
              weatherUrl
                .replace("_lat_", place.latitude)
                .replace("_lon_", place.longitude)
            )
            .then((res) => {
              const placeWeather = res.data;
              const customIconPNG = icons[placeWeather.weather[0].icon];
              const customIcon = new mapboxgl.Marker({
                element: document.createElement("div"),
                anchor: "bottom", // Adjust the anchor point based on the icon's design
                offset: [0, -15], // Adjust the offset based on the icon's size and position
              })
                .setLngLat([place.longitude, place.latitude])
                .addTo(map);
              console.log(customIcon);
              const customIconElement = customIcon.getElement();
              customIconElement.style.backgroundImage = `url(${customIconPNG})`;
              customIconElement.style.height = "40px";
              customIconElement.style.width = "40px";
              customIconElement.style.backgroundColor = "var(--bg)";
              customIconElement.style.padding = "5px";
              customIconElement.style.borderRadius = "50%";
              customIconElement.style.backgroundSize = "contain";
              customIconElement.style.backgroundRepeat = "no-repeat";
              customIconElement.style.backgroundPosition = "center";

              const textLabel = document.createElement("div");
              textLabel.textContent = place.city;
              textLabel.style.fontSize = "12px";
              textLabel.style.fontWeight = "bold";
              textLabel.style.textAlign = "center";
              textLabel.style.marginTop = "-20px";
              customIconElement.appendChild(textLabel);
              // mapRef.current.appendChild(customIcon._element);
              // console.dir(mapRef.current);
            });
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [savedCities, city, theme]);
  return (
    <>
      <div className="cheader">
        <span className="title">Global Map</span>
        <span className="view-wide-btn">
          View Wide
          <AutoAwesome fontSize="10px" style={{ color: "goldenrod" }} />
        </span>
      </div>
      <div className="map-container">
        <div id="map"></div>
      </div>
    </>
  );
}
