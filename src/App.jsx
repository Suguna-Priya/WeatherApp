import { useState, useEffect } from 'react'
import './App.css'

import cloudIcon from "./assets/cloudy.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/thermometer.png";
import searchIcon from "./assets/search-icon.png";
import snowIcon from "./assets/snowflake.png";
import sunIcon from "./assets/sun.png";
import rainIcon from "./assets/thunder.png";
import windIcon from "./assets/wind.png"
import crossIcon from "./assets/cross.png";
import natureIcon from "./assets/nature-view.png";

const WeatherDetails=({icon,temp,description,city,country,lat,long,humidity,wind})=>{

  return (
    <>
      <div className='weather-img'>
      <img src={icon} alt="weather image" />
    </div>
    <div className='temp'>{temp}°C</div>
    <div className="description">{description}</div>
    <div className='city'>{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">Latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="lat">Longtitude</span>
        <span>{long}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="humidity" className='icon'/>
        <div className="data">
          <div className="humidity-percentage">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="wind" className='icon'/>
        <div className="data">
          <div className="wind-percentage">{wind} km/hr</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </div>
    </>
  )
}


function App() {
  let apiKey = "0932f0e44837da6c9adef6d72692c4ce";
  const [text,setText] = useState();
  const [city,setCity] = useState("");
  const [desc,setDesc] = useState("");
  const [icon,setIcon] = useState()
  const [temp,setTemp] = useState()
  const [country,setCountry] = useState("");
  const [lat,setLat] = useState(0)
  const [long,setLong] = useState(0)
  const [humidity,setHumidity] = useState(0)
  const [wind,setWind] = useState(0)
  const [error,setError] = useState(null);

  const [cityNotFound,setCityNotFound] = useState(false);
  const [loading,setLoading] = useState(false);

  const [start, setStart] = useState();

  const [cross,setCross] = useState(false);

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  }

  const search = async()=>{
    setStart(false);
    setLoading(true);
    setCross(true)
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();

      if(data.cod === "404"){
        console.log("City Not Found!");
        setCityNotFound(true);
        setLoading(false);
        return 0;
      }

      setCity(data.name)
      setDesc(data.weather[0].description)
      setCountry(data.sys.country);
      setTemp(Math.floor(data.main.temp));
      setLat(data.coord.lat);
      setLong(data.coord.lon);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);

      const weatherImg = data.weather[0].icon;
      setIcon(weatherIconMap[weatherImg] || sunIcon)
      setCityNotFound(false);
      
    }catch(err){
      console.log("Error occured: "+err);
      setError("Error occured while fetching data");

    }finally{
      setLoading(false);
    }

    
  }

  
  const handleCity=(e)=>{
    setCross(false);
    setText(e.target.value);
  } 

  const handleDownKey=(e)=>{
    if(e.key === "Enter"){
      search();
    }
  }

  const clearText=()=>{
    setText('');
  }

  useEffect(function(){
    setStart(true);
  },[])

  return (
    <>
     <div className='container'>
        <div className='input-container'>
          <input type="text" className='city-input' value={text} placeholder='Enter City'onChange={handleCity} onKeyDown={handleDownKey}/>
          <div className='search-icon-div'>
            {!cross && <img src={searchIcon} alt="search" className='search-icon' onClick={search}/>}
            {cross && <img src={crossIcon} alt="clear" className='cross-icon' onClick={clearText}/>}
          </div>
        </div>

        {loading && <div className='loading'>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {cityNotFound && !loading && <div className="city-not-found">City Not Found</div>}

        {start && <div className="startApp">
          <img src={natureIcon} alt="nature" className='nature-icon'/>
          Type City and get to know <br /> the Weather of the City</div>}

        {!loading && !cityNotFound && !start && <WeatherDetails icon={icon} temp={temp} city={city} description={desc} country={country}
        lat={lat} long={long} humidity={humidity} wind={wind}/>}

        <p>Designed by <span>Suguna Priya</span> </p>
     </div>
    </>
  )
}

export default App
