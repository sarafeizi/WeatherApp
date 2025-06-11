import React from 'react';
import styles from "../src/weather.module.css";

const SearchBar = ({ location, handleChange, searchLocation, error }) => {
    return (
        <>
            <div className={`d-flex flex-column flex-md-row justify-content-center ${styles.search}`}>
                <input
                    value={location}
                    onChange={handleChange}
                    onKeyDown={searchLocation}
                    placeholder="نام شهر را وارد کنید..."
                    type="text"
                    className={`${styles.input} col-12 col-sm-8 col-md-8 col-lg-5 mb-2 mb-md-0`}
                    style={{ minWidth: 0 }}
                />
                <button
                    onClick={searchLocation}
                    className={`${styles.button} btn col-12 col-sm-3 col-md-2 col-lg-2`}
                    disabled={location.trim() === ""}
                >
                    جستجو
                </button>
            </div>
            {error && (
                <p className="text-danger mt-3 text-end" style={{ direction: 'rtl' }}>
                    {error}
                </p>
            )}
        </>
    );
};

export default SearchBar;
