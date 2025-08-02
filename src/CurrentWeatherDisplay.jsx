
import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import styles from "../src/weather.module.css";

const CurrentWeatherDisplay = ({ data, isFavorite, toggleFavorite, dateBuilder }) => {
    if (!data || !data.city || !data.list || data.list.length === 0) {
        return null;
    }

    const currentWeatherData = data.list[0];
const getWindDirection = (deg) => {
  if (deg >= 337.5 || deg < 22.5) return "شمال";
  if (deg >= 22.5 && deg < 67.5) return "شمال‌شرق";
  if (deg >= 67.5 && deg < 112.5) return "شرق";
  if (deg >= 112.5 && deg < 157.5) return "جنوب‌شرق";
  if (deg >= 157.5 && deg < 202.5) return "جنوب";
  if (deg >= 202.5 && deg < 247.5) return "جنوب‌غرب";
  if (deg >= 247.5 && deg < 292.5) return "غرب";
  if (deg >= 292.5 && deg < 337.5) return "شمال‌غرب";
  return "نامشخص";
};
    return (
        <>
            <div className="d-flex align-items-center justify-content-center mt-3 mb-2">
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

            <div className={styles.date}>{dateBuilder(new Date())}</div>

            <div className="container">
                <div className="d-flex flex-column align-items-center">
                    <h1 className={styles.tempday}>{currentWeatherData.main.temp.toFixed()}°C</h1>
                    <img
                        className={styles.img}
                        src={`http://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png`}
                        alt="weather icon"
                    />
                    <p>{currentWeatherData.weather[0].description}</p>

                    <div className="d-flex flex-wrap mt-4">
                        <div className="text-center mx-2 mb-3 flex-grow-1" style={{ minWidth: '150px' }}>
                            <p>احساس واقعی</p>
                            <p className="fw-bold">{currentWeatherData.main.feels_like.toFixed()}°C</p>
                        </div>
                        <div className="text-center mx-2 mb-3 flex-grow-1" style={{ minWidth: '150px' }}>
                            <p>رطوبت</p>
                            <p className="fw-bold">{currentWeatherData.main.humidity}%</p>
                        </div>
                        <div className="text-center mx-2 mb-3 flex-grow-1" style={{ minWidth: '150px' }}>
                            <p>سرعت باد</p>
                            <p className="fw-bold" style={{direction: 'ltr'}}>{currentWeatherData.wind.speed.toFixed()} m/s</p>
                        </div>
                         <div className="text-center mx-2 mb-3 flex-grow-1" style={{ minWidth: '150px' }}>
                            <p>جهت باد</p>
                      <p className="fw-bold">{getWindDirection(currentWeatherData.wind.deg)}</p>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CurrentWeatherDisplay;