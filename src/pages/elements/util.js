import sunRain from "../../assets/sun-rain.png";
import rain from "../../assets/rain.png";
import snow from "../../assets/snow.png";
import sunCloud from "../../assets/sun-cloud.png";
import sun from "../../assets/sun.png";
import thunderstorm from "../../assets/thunderstorm.png";

const week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const icons = {
  "01d": sun,
  "02d": sunCloud,
  "03d": sunCloud,
  "04d": sunCloud,
  "09d": rain,
  "10d": sunRain,
  "11d": thunderstorm,
  "13d": snow,
  "50d": sunCloud,
  "01n": sun,
  "02n": sunCloud,
  "03n": sunCloud,
  "04n": sunCloud,
  "09n": rain,
  "10n": sunRain,
  "11n": thunderstorm,
  "13n": snow,
  "50n": sunCloud,
};

export { week, icons };
