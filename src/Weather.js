import React, { useState, useEffect } from 'react';
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
import { FaStar, FaRegStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./weather.module.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

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

const API_KEY = "e90c7902b15b8c690182bb581503f6c3";

const Weather = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(() => {
    return localStorage.getItem("lastSearchedCity") || "";
  });
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteCities");
    return saved ? JSON.parse(saved) : [];
  });
  const [favoritesWeather, setFavoritesWeather] = useState({}); // ذخیره آیکن آب‌وهوا برای هر شهر محبوب

  // بارگذاری آیکن آب‌وهوا برای علاقه‌مندی‌ها
  useEffect(() => {
    favorites.forEach(async (city) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric&lang=fa`;
        const res = await axios.get(url);
        setFavoritesWeather(prev => ({
          ...prev,
          [city.name]: res.data.weather[0].icon,
        }));
      } catch {
        // خطاها رو نادیده بگیریم
      }
    });
  }, [favorites]);

  // فراخوانی API
  const fetchWeatherByCity = async (cityName) => {
    if (!cityName || cityName.trim() === "") return;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=fa`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      setError("");
      setLocation('');
      localStorage.setItem("lastSearchedCity", cityName);
    } catch (err) {
      setError("شهر مورد نظر یافت نشد. لطفاً دوباره تلاش کنید.");
      setData(null);
    }
  };

  // جستجو در دکمه کلیک یا Enter
  const searchLocation = (event) => {
    if ((event.key === 'Enter' || event.type === "click") && location.trim() !== "") {
      fetchWeatherByCity(location);
    }
  };

  // اضافه کردن به علاقه‌مندی‌ها
  const addFavorite = (city) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.name === city.name && item.country === city.country);
      if (exists) {
        toast.info(`${city.name} قبلاً در علاقه‌مندی‌ها بود.`);
        return prev;
      }

      const updated = [...prev, city];
      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      toast.success(`${city.name} به علاقه‌مندی‌ها اضافه شد.`);
      return updated;
    });
  };

  // حذف از علاقه‌مندی‌ها
  const removeFavorite = (city) => {
    setFavorites(prev => {
      const updated = prev.filter(item => !(item.name === city.name && item.country === city.country));
      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      toast.info(`${city.name} از علاقه‌مندی‌ها حذف شد.`);
      return updated;
    });
  };

  // ** اینجا تابع clearFavorites تغییر کرد **
  const clearFavorites = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید همه شهرهای محبوب را حذف کنید؟")) {
      setFavorites([]);
      localStorage.removeItem("favoriteCities");
      toast.info("تمام علاقه‌مندی‌ها حذف شدند.");
    }
  };

  // بررسی وجود در علاقه‌مندی‌ها
  const isFavorite = (city) => {
    return favorites.some(item => item.name === city.name && item.country === city.country);
  };

  const toggleFavorite = () => {
    if (!data || !data.city) return;
    const city = {
      name: data.city.name,
      country: data.city.country,
      coord: data.city.coord,
    };
    if (isFavorite(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row justify-content-center">
        <div className={`col-12 col-md-10 col-lg-8 ${data?.list && data?.list[0]?.main?.temp > 25 ? styles.appwarm : styles.app}`}>
          <div className={styles.bigdiv}>
            <div className={`d-flex flex-column flex-md-row justify-content-center ${styles.search}`}>
              <input
                value={location}
                onChange={handleChange}
                onKeyDown={searchLocation}
                placeholder="نام شهر را وارد کنید..."
                type="text"
                className={`${styles.input} col-12 col-sm-8 col-md-8 col-lg-5 mb-2 mb-md-0`}
                style={{ minWidth: 0 }} // برای جلوگیری از overflow در برخی مرورگرها
              />
              <button
                onClick={searchLocation}
                className={`${styles.button} btn col-12 col-sm-3 col-md-2 col-lg-2`}
              >
                جستجو
              </button>
            </div>


            {error && <p className="text-danger mt-3 text-end" style={{ direction: 'rtl' }}>{error}</p>}

            {data && data.city && (
              <div className="d-flex align-items-center justify-content-center mt-3 mb-2" >
                <p className="mb-0 fw-semibold fs-5 me-2">
                  {data.city.name}، {data.city.country}
                </p>
                <span
                  onClick={toggleFavorite}
                  className="cursor-pointer"
                  style={{ color: isFavorite(data.city) ? '#d5d500' : 'gray', fontSize: '1.8rem', marginRight: '2%' }}
                  title={isFavorite(data.city) ? 'حذف از علاقه مندی‌ها' : 'افزودن به علاقه مندی‌ها'}
                  aria-label={isFavorite(data.city) ? 'حذف از علاقه مندی‌ها' : 'افزودن به علاقه مندی‌ها'}
                >
                  {isFavorite(data.city) ? <FaStar /> : <FaRegStar />}
                </span>
              </div>
            )}

            {data && data.city && (
              <div className={styles.date}>{dateBuilder(new Date())}</div>
            )}

            {data && data.city ? (
              <>
                <div className="container">
                  <div className="d-flex flex-column align-items-center">
                    <h1 className={styles.tempday}>{data.list[0].main.temp.toFixed()}°C</h1>
                    <img
                      className={styles.img}
                      src={`http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`}
                      alt="weather icon"
                    />
                    <p >{data.list[0].weather[0].description}</p>

                    <div className="d-flex flex-wrap mt-4">
                      <div className="text-center mx-2 mb-3 flex-grow-1" style={{ minWidth: '150px' }}>
                        <p>احساس واقعی</p>
                        <p className="fw-bold">{data.list[0].main.feels_like.toFixed()}°C</p>
                      </div>
                      <div className="text-center mx-2 mb-3 flex-grow-1" style={{ minWidth: '150px' }}>
                        <p>رطوبت</p>
                        <p className="fw-bold">{data.list[0].main.humidity}%</p>
                      </div>
                      <div className="text-center mx-2 mb-3 flex-grow-1" style={{ minWidth: '150px' }}>
                        <p>سرعت باد</p>
                        <p className="fw-bold">{data.list[0].wind.speed.toFixed()} m/s</p>
                      </div>
                    </div>

                  </div>

                  {/* 4-day forecast */}
                  <div className="row justify-content-center mt-4 g-3">
                    {getDailyForecasts().map((forecast, index) => (
                      <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                        key={forecast.dt}
                      >
                        <div
                          className={`${styles.tomorrow} d-flex flex-column align-items-center p-3 rounded shadow-sm`}
                        >
                          <p className="mb-2 fw-bold">
                            {index === 0
                              ? "فردا"
                              : index === 1
                                ? "پس‌فردا"
                                : index === 2
                                  ? "پسون‌فردا"
                                  : "پس پسون‌فردا"}
                          </p>
                          <h1 className="mb-2">{forecast.main.temp.toFixed()}°C</h1>
                          <img
                            className={styles.img1}
                            src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                            alt={forecast.weather[0].description}
                            style={{ marginBottom: "10px" }}
                          />
                          <p >{forecast.weather[0].description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Map */}
                  <div style={{ height: "300px", marginTop: "20px" }} className="rounded overflow-hidden shadow-sm">
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

                  {/* Chart */}
                  <div className="mt-5">
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

            {/* Favorites */}
            <div className="mt-4 text-center">
              <h5 className="mb-3 text-secondary d-flex justify-content-center align-items-center">
                شهرهای محبوب:
                {favorites.length > 0 && (
                  <button
                    onClick={clearFavorites}
                    className="btn btn-sm btn-danger ms-3"
                    title="حذف همه"
                    aria-label="حذف همه علاقه مندی‌ها"
                  >
                    حذف همه
                  </button>
                )}
              </h5>

              {favorites.length === 0 && (
                <p className="text-muted">هیچ شهری به محبوب‌ها اضافه نشده است.</p>
              )}

              <ul className="list-unstyled p-0 m-0">
                {favorites.map((city, index) => (
                  <li
                    key={index}
                    className="mx-auto mb-3 p-3 rounded shadow-sm d-flex justify-content-between align-items-center"
                    style={{ maxWidth: "300px", backgroundColor: "#f9f9f9", transition: "background-color 0.3s ease", cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0f7fa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  >
                    <span
                      className="fw-semibold text-primary d-flex align-items-center"
                      style={{ fontSize: "1rem" }}
                      onClick={() => fetchWeatherByCity(city.name)}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      {/* آیکون آب‌وهوا کنار نام */}
                      {favoritesWeather[city.name] && (
                        <img
                          src={`http://openweathermap.org/img/w/${favoritesWeather[city.name]}.png`}
                          alt="weather icon"
                          style={{ width: 24, height: 24, marginLeft: 8 }}
                        />
                      )}
                      {city.name}, {city.country}
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); removeFavorite(city); }}
                      className="btn p-0 m-0 text-danger fw-bold border-0"
                      style={{ fontSize: "1.2rem", lineHeight: 1, background: "none", transition: "transform 0.2s ease" }}
                      title="حذف"
                      aria-label={`حذف ${city.name}`}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
