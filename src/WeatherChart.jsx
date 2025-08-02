import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const WeatherChart = ({ forecastList }) => {
  if (!forecastList) return null;

  const dailyData = forecastList
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 5)
    .map(item => ({
      date: item.dt_txt.split(" ")[0],
      temp: item.main.temp,
      humidity: item.main.humidity,
      wind: item.wind.speed,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temp" stroke="#ff7300" name="دما (°C)" />
        <Line type="monotone" dataKey="humidity" stroke="#387908" name="رطوبت (%)" />
        <Line type="monotone" dataKey="wind" stroke="#8884d8" name="سرعت باد (m/s)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;