import { useEffect, useState } from "react";
import "../../styles/graph.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function RainForecast({ weatherData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(weatherData);

    const rainData = weatherData?.list.map((weather) => {
      const time = new Date(weather.dt_txt);
      const formattedTime = time.toLocaleString("en-US", {
        weekday: "short",
      });
      return {
        cm: weather.rain ? weather.rain["3h"] : 0,
        time: formattedTime,
      };
    });
    setData(rainData);
  }, [weatherData]);

  return (
    <div>
      <div className="header">
        <span className="title">Chance of rain</span>
      </div>
      <div className="chart">
        <LineChart
          width={400}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Legend />

          <Line type="monotone" dataKey="cm" stroke="#82ca9d" dot={null} />
        </LineChart>
      </div>
    </div>
  );
}
