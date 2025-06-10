import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from './SearchBar';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import ForecastDisplay from './ForecastDisplay';
import WeatherMap from './WeatherMap';
import WeatherChart from './CurrentWeatherDisplay'; 
import FavoritesList from './FavoritesList';
import styles from "./weather.module.css";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


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
  const [favoritesWeather, setFavoritesWeather] = useState({});

  useEffect(() => {
    const lastCity = localStorage.getItem("lastSearchedCity");
    if (lastCity) {
      fetchWeatherByCity(lastCity);
    }
  }, []); 
  useEffect(() => {
    const fetchFavoriteIcons = async () => {
      const newFavoritesWeather = {};
      for (const city of favorites) {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric&lang=fa`;
          const res = await axios.get(url);
          newFavoritesWeather[city.name] = res.data.weather[0].icon;
        } catch (err) {
          console.error(`Failed to fetch weather for favorite city ${city.name}:`, err);
        }
      }
      setFavoritesWeather(newFavoritesWeather);
    };

    if (favorites.length > 0) {
      fetchFavoriteIcons();
    } else {
      setFavoritesWeather({});
    }
  }, [favorites]); 

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
      localStorage.removeItem("lastSearchedCity"); 
    }
  };

  const searchLocation = (event) => {
    if ((event.key === 'Enter' || event.type === "click") && location.trim() !== "") {
      fetchWeatherByCity(location);
    }
  };

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

  const removeFavorite = (city) => {
    setFavorites(prev => {
      const updated = prev.filter(item => !(item.name === city.name && item.country === city.country));
      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      toast.info(`${city.name} از علاقه‌مندی‌ها حذف شد.`);
      return updated;
    });
  };

  const clearFavorites = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید همه شهرهای محبوب را حذف کنید؟")) {
      setFavorites([]);
      localStorage.removeItem("favoriteCities");
      toast.info("تمام علاقه‌مندی‌ها حذف شدند.");
    }
  };

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
      <div className="row justify-content-center">
        <div className={`col-12 col-md-10 col-lg-8 ${data?.list && data?.list[0]?.main?.temp > 25 ? styles.appwarm : styles.app}`}>
          <div className={styles.bigdiv}>
            <SearchBar
              location={location}
              handleChange={handleChange}
              searchLocation={searchLocation}
              error={error}
            />

            {data && data.city ? (
              <>
                <CurrentWeatherDisplay
                  data={data}
                  isFavorite={isFavorite}
                  toggleFavorite={toggleFavorite}
                  dateBuilder={dateBuilder}
                />
                <ForecastDisplay forecasts={getDailyForecasts()} />
                <WeatherMap
                  lat={data.city.coord.lat}
                  lon={data.city.coord.lon}
                  cityName={data.city.name}
                  countryName={data.city.country}
                />
                <div className="mt-5">
                  <WeatherChart forecastList={data.list} />
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

            <FavoritesList
              favorites={favorites}
              favoritesWeather={favoritesWeather}
              fetchWeatherByCity={fetchWeatherByCity}
              removeFavorite={removeFavorite}
              clearFavorites={clearFavorites}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;