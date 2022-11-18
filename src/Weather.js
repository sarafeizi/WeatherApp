import axios from 'axios';
import React, { useState  } from 'react';
 import styles from "./weather.module.css";
 

const Weather = () => {
    const[data,setdata]=useState([]);
    const[location,setlocation]=useState("");
 
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=e90c7902b15b8c690182bb581503f6c3`
    const searchLocation = (event) => {
      
        if (event.key === 'Enter') {
          axios.get(url).then((response) => {
            setdata(response.data);
          })
          setlocation('')
   
        }
     
    }
    const searchme=()=>{
      axios.get(url).then((response)=>{
        setdata(response.data)
      })
      setlocation("");
    }
    const searchhandler=(event)=>{
       setlocation(event.target.value)
     
    }

  
    const dateBuilder = (d) => {
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
  
      return `${day} ${date} ${month} ${year}`
    }
 
 
 
    return (
      <div className='container '> 
      <div className='row'> 
        <div  className={data?.list ?   ((typeof data?.list[0]?.main != "undefined") ? (((data?.list[0]?.main.temp-273).toFixed() > 25) ? styles.appwarm : styles.app) : styles.app ) : styles.container }>
        <div className={`${styles.bigdiv}  `}> 
              <div className={`${styles.search} col d-flex    `}>
        <input
          value={location}
          onChange={searchhandler}
          onKeyPress={searchLocation}
          placeholder='Enter City ...'
          type="text"
          className={`${styles.input} col-sm-8 col-md-8 col-lg-5 col-xs-9  `} />
          <button onClick={searchme}  className={`${styles.button} btn col-sm-3 col-xs-3 col-md-2 col-lg-2 `} >search</button>
          
      </div>
      
      { data?.city?.name  !== undefined ?
      <div className="container">
        <div className={styles.date}>{dateBuilder(new Date())}</div>
     
        
        <div className={styles.temp}>
          <div className={`${styles.flex} col-xs-12` }>
          <div className="temp">
          <div className={styles.location}>
          <p> City : {data?.city?.name} , Country : {data?.city?.country} </p>  </div>
            {data?.list ? <h1 className={styles.tempday} >{(data?.list[0].main.temp- 273).toFixed()}°C</h1> : null}
            {data?.list ? <img className={styles.img} alt="icon" src= {`http://openweathermap.org/img/w/${data?.list[0]?.weather[0]?.icon}.png`}></img> : null}
             
          </div>
       
         
  
   
          <div className={`${styles.bottom} col-xs-12`}>
            <div className={`${styles.feels} col-xs-12 `}>
              {data?.list[0]?.main ? <p className='bold'>{(data.list[0].main.feels_like- 273).toFixed()}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className={styles.humidity}>
              {data?.list[0]?.main ? <p className='bold'>{data.list[0].main.humidity}%</p> : null}
              <p> humidity
              </p>
            </div>
            <div className={styles.wind}>
              {data.list[0].wind ? <p className='bold'>{(data.list[0].wind.speed/0.44704).toFixed()} m/s </p> : null}
              <p>Wind Speed</p>
            </div>
            </div>
            </div>
          
         <div className={`${styles.forecast} col`}>
           


          <div className={`${styles.tomorrow}  col-xs-12 col-sm-6 col-md-6 col-lg-3`}>
            <p className={styles.ptomorow}>دمای فردا</p>
            <div className={styles.flextomorrow}>
            <img className={styles.img1} src= {`http://openweathermap.org/img/w/${data?.list[1]?.weather[0]?.icon}.png`} alt="icon"></img>
            {data?.list[1]?.main ? <h1>{(data?.list[1]?.main.temp- 273).toFixed()}°C</h1> : null}
            </div>
            { data?.list[1]?.weather ? <p className={styles.pflextomorrow}>{data?.list[1]?.weather[0].description}</p> : null}
          </div>



          <div  className={`${styles.tomorrow}  col-xs-12 col-sm-6 col-md-6 col-lg-3`}>
          <p className={styles.ptomorow}>دمای پسفردا</p>
          <div className={styles.flextomorrow}>
          <img className={styles.img1} src= {`http://openweathermap.org/img/w/${data?.list[2]?.weather[0]?.icon}.png`} alt="icon"></img>
          {data?.list[2]?.main ? <h1>{(data?.list[2]?.main.temp- 273).toFixed()}°C</h1> : null}
          </div>
          { data?.list[2]?.weather ? <p className={styles.pflextomorrow}>{data?.list[2]?.weather[0].description}</p> : null}
          </div>
          


          <div  className={`${styles.tomorrow}  col-xs-12 col-sm-6 col-md-6 col-lg-3`}>
          <p className={styles.ptomorow}>دمای پسونفردا</p>
          <div className={styles.flextomorrow}>
          <img className={styles.img1} src= {`http://openweathermap.org/img/w/${data?.list[3]?.weather[0]?.icon}.png`} alt="icon"></img>
          {data?.list[3]?.main ? <h1>{(data?.list[3]?.main.temp- 273).toFixed()}°C</h1> : null}
          </div>
          {data?.list[3]?.weather ? <p className={styles.pflextomorrow}>{data?.list[3]?.weather[0].description}</p> : null}
          </div>


          <div  className={`${styles.tomorrow}  col-xs-12 col-sm-6 col-md-6 col-lg-3`}>
          <p className={styles.ptomorow}>دمای پس پسونفردا</p>
          <div className={styles.flextomorrow}>
          <img className={styles.img1} src= {`http://openweathermap.org/img/w/${data?.list[4]?.weather[0]?.icon}.png`} alt="icon"></img>
          {data?.list[4]?.main ? <h1>{(data?.list[4]?.main.temp- 273).toFixed()}°C</h1> : null}
          </div>
          {data?.list[4]?.weather ? <p className={styles.pflextomorrow}>{data?.list[4]?.weather[0].description}</p> : null}
          </div>
        </div>



       
 </div>
      </div>
:  <div> <div className={ styles.frame}>
<div class= {styles.center}>
  <div class= {styles.carousel}>
    <div class={`${styles.pre} h6-sm`}>Search Ur City Or Location If u Want To Know </div>
    <div class={styles.changeouter}>
      <div class={styles.changeinner}>
        <div class={styles.element}>Temp</div>
        <div class= {styles.element}>Humidity</div>
        <div class={styles.element}>Forecast Weather</div>
        <div class={styles.element}>Wind Speed</div>
        <div class={styles.element}>Temp</div>
    
      </div>
    </div>
  </div>
</div>
</div>
{/* <div className={styles.scene}>
  <img className={styles.city} src={city}></img>
  <img className={styles.plane} src={plane}></img>
  <img className={styles.cloud1} src={cloud}></img>
  <img className={styles.cloud2} src={cloud}></img>
  <img className={styles.cloud3} src={cloud}></img>
  <img className={styles.boat} src={boat}></img>
</div> */}


</div>}
      </div>
    </div>
    </div></div>
    );
};
export default Weather;
  