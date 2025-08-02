import React from 'react';
const FavoritesList = ({ favorites, favoritesWeather, fetchWeatherByCity, removeFavorite, clearFavorites }) => {
    return (
        <div className="text-center" style={{ marginTop: '4rem' }}>

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
                        style={{
                            maxWidth: "300px",
                            backgroundColor: "#f9f9f9",
                            transition: "background-color 0.3s ease",
                            cursor: 'pointer' 
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0f7fa'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onClick={() => fetchWeatherByCity(city.name)} 
                    >
                        <span
                            className="fw-semibold d-flex align-items-center"
                            style={{ fontSize: "1rem", color: 'black' }}  
                        >
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
    );
};

export default FavoritesList;