import { useEffect, useRef, useState } from "react";
import "../../styles/weeklyforecast.css";
import { week, icons } from "./util";

export default function WeeklyForecast({ weatherData }) {
  const [foreCastOption, setForecastOption] = useState("forecast");
  const foreCastToggleRef = useRef(null);
  const [activeDay, setActiveDay] = useState(week[new Date().getDay()]);
  const [data, setData] = useState([]);
  const [timeStr, setTimeStr] = useState(getTimeAmPm(new Date()));

  useEffect(() => {
    console.log(weatherData);
    try {
      const data = [];
      for (const ele of weatherData.list) {
        const idx = data.findIndex(
          (dt) => dt.date.split(" ")[0] === ele.dt_txt.split(" ")[0]
        );
        if (idx === -1) {
          data.push({
            date: ele.dt_txt,
            ...ele.main,
            wind: ele.wind,
            icon: ele.weather[0].icon,
            sunrise: new Date(weatherData.city.sunrise).getTime(),
            sunset: new Date(weatherData.city.sunset).getTime(),
          });
        }
      }
      console.log(data);
      setData(data);
    } catch (e) {
      console.error("Weather Data Does Not Exists", e);
    }
  }, [weatherData]);

  useEffect(() => {
    if (foreCastOption === "forecast") {
      foreCastToggleRef.current.style.left = "0%";
    } else {
      foreCastToggleRef.current.style.left = "50%";
    }
  }, [foreCastOption]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(getTimeAmPm(new Date()));
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="card weekly-forecast">
      <div className="header">
        <div className="day-titles">
          <span
            style={{
              cursor: "pointer",
              borderBottom: "1px solid var(--activeTextColor)",
            }}
            onClick={() => setActiveDay(week[new Date().getDay()])}
          >
            Today
          </span>
          <span
            style={{
              cursor: "pointer",
              borderBottom: "1px solid var(--activeTextColor)",
            }}
            onClick={() =>
              setActiveDay(
                week[new Date().getDay() < 6 ? new Date().getDay() + 1 : 0]
              )
            }
          >
            Tomorrow
          </span>
          <b>
            <span>Next 5 Days</span>
          </b>
        </div>
        <div
          className="forecast-toggle"
          onClick={() =>
            setForecastOption(
              foreCastOption === "forecast" ? "air" : "forecast"
            )
          }
        >
          <div
            className="forecast-toggle__before"
            ref={foreCastToggleRef}
          ></div>
          <div className="fc-options">
            <span
              style={{
                color: foreCastOption === "forecast" ? "var(--bg)" : "inherit",
              }}
            >
              Forecast
            </span>
            <span
              style={{
                color: foreCastOption === "air" ? "var(--bg)" : "inherit",
              }}
            >
              Air Quality
            </span>
          </div>
        </div>
      </div>
      <div className="weekdays">
        {data.length > 0 ? (
          data.map((dt, idx) => (
            <Weekday
              key={idx}
              dt={dt}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              timeStr={timeStr}
            />
          ))
        ) : (
          <div className="loading-skele">
            <div className="loader-inner"></div>
            <h1
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Loading...
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAmPm(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

function Weekday({ dt, activeDay, setActiveDay, timeStr }) {
  const dayNum = new Date(dt.date).getDay();
  const day = week[dayNum];

  return (
    <div
      className={day === activeDay ? "day-body active-day" : "day-body"}
      onClick={() => setActiveDay(day)}
      key={day}
    >
      {day === activeDay ? (
        <div className="expanded-content">
          <div className="more-content-title">
            <span>{day}</span>
            <span>
              {day === week[new Date().getDay()] ? timeStr : "12:00 AM"}
            </span>
          </div>
          <div className="expanded-content-grid">
            <div className="expanded-temp temp">
              {Math.round(dt.temp - 273.15)}
              <sup>
                <span style={{ fontSize: "1rem" }}>°C</span>
              </sup>
            </div>
            <div className="img-container1">
              <img src={icons[dt.icon]} className="weather-img-expanded"></img>
            </div>

            <div className="info-1">
              <ul>
                <li>
                  <span>Real Feel: </span>
                  <span>
                    {Math.round(dt.feels_like - 273.15)}
                    <sup>
                      <span>°c</span>
                    </sup>
                  </span>
                </li>
                <li>
                  <span>Wind: </span>
                  <span>{dt.wind.speed}km/h</span>
                </li>
                <li>
                  <span>Pressure: </span>
                  <span>{dt.pressure}MB</span>
                </li>
                <li>
                  <span>Humidity: </span>
                  <span>{dt.humidity}%</span>
                </li>
              </ul>
            </div>
            <div className="info-2">
              <ul>
                <li>
                  <span>Sun Rise: </span>
                  <span>{getTimeAmPm(new Date(dt.sunrise))}</span>
                </li>
                <li>
                  <span>Sun Set: </span>
                  <span>{getTimeAmPm(new Date(dt.sunset))}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="collapsed-content">
          <div className="day-title">{day.substr(0, 3)}</div>
          <div className="divider"></div>
          <div className="img-container2">
            <img src={icons[dt.icon]} className="weather-img"></img>
          </div>
          <div className="temp">
            {Math.round(dt.temp - 273.15)}
            <sup>
              <span style={{ fontSize: "1rem" }}>°C</span>
            </sup>
          </div>
        </div>
      )}
    </div>
  );
}
