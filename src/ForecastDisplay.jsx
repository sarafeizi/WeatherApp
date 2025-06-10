
import React from 'react';
import styles from "../src/weather.module.css"; 

const ForecastDisplay = ({ forecasts }) => {
    if (!forecasts || forecasts.length === 0) {
        return null;
    }

    const getDayName = (index) => {
        switch (index) {
            case 0: return "فردا";
            case 1: return "پس‌فردا";
            case 2: return "پسون‌فردا";
            case 3: return "پس پسون‌فردا";
            default: return "";
        }
    };

    return (
        <div className="row justify-content-center mt-4 g-3">
            {forecasts.map((forecast, index) => (
                <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    key={forecast.dt}
                >
                    <div
                        className={`${styles.tomorrow} d-flex flex-column align-items-center p-3 rounded shadow-sm`}
                    >
                        <p className="mb-2 fw-bold">{getDayName(index)}</p>
                        <h1 className="mb-2">{forecast.main.temp.toFixed()}°C</h1>
                        <img
                            className={styles.img1}
                            src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                            alt={forecast.weather[0].description}
                            style={{ marginBottom: "10px" }}
                        />
                        <p>{forecast.weather[0].description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ForecastDisplay;