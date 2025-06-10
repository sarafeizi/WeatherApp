import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
import styles from "./weather.module.css";

// رفع مشکل آیکون مارکر در React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// کامپوننت کمکی برای تغییر مرکز نقشه
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

// کامپوننت نمودار آب‌وهوا
const WeatherChart = ({ forecastList }) => {
  if (!forecastList) return null;

  // فقط داده‌های ساعت 12 ظهر را برای 5 روز آینده می‌گیریم
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

const Weather = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  // وضعیت شهرهای محبوب
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteCities");
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = "e90c7902b15b8c690182bb581503f6c3";

  // تابع فراخوانی API برای دریافت آب‌وهوا
  const fetchWeatherByCity = async (cityName) => {
    if (!cityName || cityName.trim() === "") return;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=fa`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      setError("");
      setLocation(''); // پاک کردن ورودی
    } catch (err) {
      setError("شهر مورد نظر یافت نشد. لطفاً دوباره تلاش کنید.");
      setData(null);
    }
  };

  // جستجو با کلیک یا Enter
  const searchLocation = (event) => {
    if ((event.key === 'Enter' || event.type === "click") && location.trim() !== "") {
      fetchWeatherByCity(location);
    }
  };

  // اضافه کردن شهر به محبوب‌ها
  const addFavorite = () => {
    if (!data || !data.city) return;
    const city = {
      name: data.city.name,
      country: data.city.country,
      coord: data.city.coord,
    };

    setFavorites(prev => {
      const exists = prev.find(item => item.name === city.name && item.country === city.country);
      if (exists) return prev;

      const updated = [...prev, city];
      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      return updated;
    });
  };

  // حذف شهر از محبوب‌ها
  const removeFavorite = (city) => {
    setFavorites(prev => {
      const updated = prev.filter(item => !(item.name === city.name && item.country === city.country));
      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      return updated;
    });
  };

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  const dateBuilder = (d) => {
    const months = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "جولای", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];
    const days = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getDailyForecasts = () => {
    if (!data || !data.list) return [];
    return data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 4);
  };

  return (
    <div className="container">
      <div className="row">
        <div className={data?.list && data?.list[0]?.main?.temp > 25 ? styles.appwarm : styles.app}>
          <div className={styles.bigdiv}>

            <div className={`d-flex ${styles.search}`}>
              <input
                value={location}
                onChange={handleChange}
                onKeyDown={searchLocation}
                placeholder="نام شهر را وارد کنید..."
                type="text"
                className={`${styles.input} col-sm-8 col-md-8 col-lg-5`}
              />
              <button onClick={searchLocation} className={`${styles.button} btn col-sm-3 col-md-2 col-lg-2`}>جستجو</button>
            </div>

            {/* پیام خطا */}
            {error && <p className="text-danger mt-3" style={{ textAlign: 'right', direction: 'rtl' }}>{error}</p>}

            {/* دکمه افزودن به محبوب‌ها */}
            {data && data.city && (
              <div style={{ marginTop: '15px', textAlign: 'right' }}>
                <button onClick={addFavorite} className={`${styles.button} btn btn-success`}>
                  افزودن به شهرهای محبوب
                </button>
              </div>
            )}

            {/* نمایش لیست شهرهای محبوب */}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <h5>شهرهای محبوب:</h5>
              {favorites.length === 0 && <p>هیچ شهری به محبوب‌ها اضافه نشده است.</p>}
              <ul style={{ listStyle: 'none', paddingRight: 0 }}>
                {favorites.map((city, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    <span
                      style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                      onClick={() => fetchWeatherByCity(city.name)}
                    >
                      {city.name}, {city.country}
                    </span>
                    <button
                      onClick={() => removeFavorite(city)}
                      style={{ marginLeft: "10px", color: "red", border: 'none', background: 'none', cursor: 'pointer' }}
                      title="حذف"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {data && data.city ? (
              <>
                <div className="container">
                  <div className={styles.date}>{dateBuilder(new Date())}</div>

                  <div className={styles.temp}>
                    <div className={styles.location}>
                      <p>شهر: {data.city.name}، کشور: {data.city.country}</p>
                    </div>
                    <h1 className={styles.tempday}>{data.list[0].main.temp.toFixed()}°C</h1>
                    <img
                      className={styles.img}
                      src={`http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`}
                      alt="icon"
                    />

                    <div className={styles.bottom}>
                      <div className={styles.feels}>
                        <p>احساس واقعی</p>
                        <p className="bold">{data.list[0].main.feels_like.toFixed()}°C</p>
                      </div>
                      <div className={styles.humidity}>
                        <p>رطوبت</p>
                        <p className="bold">{data.list[0].main.humidity}%</p>
                      </div>
                      <div className={styles.wind}>
                        <p>سرعت باد</p>
                        <p className="bold">{data.list[0].wind.speed.toFixed()} m/s</p>
                      </div>
                    </div>
                  </div>

                  {/* پیش‌بینی 4 روز آینده */}
                  <div className={`${styles.forecast} row`}>
                    {getDailyForecasts().map((forecast, index) => (
                      <div
                        className={`col-xs-12 col-sm-6 col-md-6 col-lg-3 ${styles.tomorrow}`}
                        key={forecast.dt}
                      >
                        <p className={styles.ptomorow}>
                          {index === 0
                            ? "فردا"
                            : index === 1
                            ? "پس‌فردا"
                            : index === 2
                            ? "پسون‌فردا"
                            : "پس پسون‌فردا"}
                        </p>
                        <div className={styles.flextomorrow}>
                          <img
                            className={styles.img1}
                            src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                            alt="icon"
                          />
                          <h1>{forecast.main.temp.toFixed()}°C</h1>
                        </div>
                        <p className={styles.pflextomorrow}>{forecast.weather[0].description}</p>
                      </div>
                    ))}
                  </div>

                  {/* نقشه با آپدیت مرکز (اینجا منتقل شد به پایین) */}
                  <div style={{ height: "300px", marginTop: "20px" }}>
                    <MapContainer
                      center={[data.city.coord.lat, data.city.coord.lon]}
                      zoom={10}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <ChangeMapView center={[data.city.coord.lat, data.city.coord.lon]} />
                      <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[data.city.coord.lat, data.city.coord.lon]}>
                        <Popup>
                          {data.city.name}, {data.city.country}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  {/* نمایش نمودار آب‌وهوا (اینجا منتقل شد به پایین) */}
                  <div style={{ marginTop: "30px" }}>
                    <WeatherChart forecastList={data.list} />
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.frame}>
                <div className={styles.center}>
                  <div className={styles.carousel}>
                    <div className={styles.pre} style={{ textAlign: 'right', direction: 'rtl' }}>
                      برای مشاهده‌ی آب‌وهوا، شهر خود را جستجو کنید
                    </div>
                    <div className={styles.changeouter}>
                      <div className={styles.changeinner}>
                        <div className={styles.element}>دما</div>
                        <div className={styles.element}>رطوبت</div>
                        <div className={styles.element}>پیش‌بینی هوا</div>
                        <div className={styles.element}>سرعت باد</div>
                        <div className={styles.element}>دما</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
