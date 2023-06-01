import {
  LocationOn,
  Notifications,
  Search,
  ViewStream,
  LightMode,
  DarkMode,
  FavoriteBorder,
  Favorite,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";

import "../../styles/nav.css";
import dpImg from "../../assets/dp.jpg";

export default function Nav({
  handleCitySearch,
  citiesOptions,
  theme,
  setTheme,
  setCity,
  city,
  saveCity,
  savedCities,
}) {
  const [isToggleAnimating, setIsToggleAnimating] = useState(false);
  const rootRef = useRef(document.documentElement);
  const themeRadioRef = useRef(null);
  const searchBarRef = useRef(null);
  let allowSearch = true;
  useEffect(() => {
    if (theme === "dark") {
      themeRadioRef.current.style.left = "0%";
      rootRef.current.style.setProperty("--bg", "#101014");
      rootRef.current.style.setProperty("--cardBg", " #393839");
      rootRef.current.style.setProperty("--activeTextColor", "#ffffff");
      rootRef.current.style.setProperty("--fadedTextColor", "#b0b0b0");
      rootRef.current.style.setProperty("--ltBlue", "#D5E8F7");
    } else {
      themeRadioRef.current.style.left = "50%";
      rootRef.current.style.setProperty("--bg", "white");
      rootRef.current.style.setProperty("--cardBg", " #bfbfbf");
      rootRef.current.style.setProperty("--activeTextColor", "#292828");
      rootRef.current.style.setProperty("--fadedTextColor", "#8a8888");
      rootRef.current.style.setProperty("--ltBlue", "#072842");
    }
    setIsToggleAnimating(true);
    setTimeout(() => {
      setIsToggleAnimating(false);
    }, 1000);
  }, [theme]);

  function handleKeyDown(e) {
    const cityValue = searchBarRef.current.value.trim();
    if (cityValue !== "" && allowSearch) {
      handleCitySearch(cityValue);
      allowSearch = false;
      setTimeout(() => {
        allowSearch = true;
      }, 1002);
    }
  }

  function handleCitySelection(city) {
    setCity(city);
    localStorage.setItem("location", JSON.stringify(city));
  }

  return (
    <nav>
      <ul className="nav-grid">
        <div className="nav-grid-1">
          <div className="nav-grp">
            <li>
              <a>
                <div className="roundObj">
                  <ViewStream />
                </div>
              </a>
            </li>
            <li>
              <a>
                <div className="roundObj">
                  <Notifications />
                </div>
              </a>
            </li>
            <li>
              <div className="loc-nav">
                <LocationOn fontSize="12px" />{" "}
                <div className="loc-div">
                  <b>
                    <span>{city ? city.city : "City"}, </span>
                  </b>
                  <span className="faded-text">
                    {city && city
                      ? city.country.length < 20
                        ? city.country
                        : city.countryCode
                      : "Country"}
                  </span>
                  <span
                    className="like-button"
                    onClick={() => saveCity(city, savedCities)}
                  >
                    {savedCities.find(
                      (ct) =>
                        ct.city === city.city && ct.country === city.country
                    ) ? (
                      <Favorite style={{ color: "var(--likePink)" }} />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </span>
                </div>
              </div>
            </li>
          </div>
          <div className="nav-grp">
            <li>
              <div className="search-grp">
                <div className="nav-outer">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    htmlFor="city-input"
                  >
                    <Search />
                  </label>
                  <input
                    className="nav-input"
                    id="city-input"
                    ref={searchBarRef}
                    onKeyDown={handleKeyDown}
                    // onBlur={() => setCitiesOptions(false)}
                  />
                </div>
                {citiesOptions && (
                  <div className="cities-options">
                    {citiesOptions.length > 0 ? (
                      <>
                        {citiesOptions.map((city) => (
                          <>
                            <div
                              className="city-option"
                              onClick={() => handleCitySelection(city)}
                            >
                              <span>{city.city}</span>,{" "}
                              <span>{city.country}</span>
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      "Empty"
                    )}
                  </div>
                )}
              </div>
            </li>
          </div>
        </div>
        <div className="nav-grid-2">
          <div className="nav-grp">
            <li>
              <div
                className="theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <div className="theme-toggle__before" ref={themeRadioRef}></div>
                <div className="theme-icons">
                  <div
                    className={`dark theme-icon ${
                      isToggleAnimating && theme === "dark" ? "animate" : ""
                    }`}
                  >
                    <DarkMode
                      style={{
                        color: theme === "dark" ? "var(--bg)" : "inherit",
                      }}
                    />
                  </div>
                  <div
                    className={`light theme-icon ${
                      isToggleAnimating && theme === "light" ? "animate" : ""
                    }`}
                  >
                    <LightMode
                      style={{
                        color:
                          theme === "dark"
                            ? "var(--activeTextColor)"
                            : "var(--bg)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li>
              <img src={dpImg} className="dp" />
            </li>
          </div>
        </div>
      </ul>
    </nav>
  );
}
