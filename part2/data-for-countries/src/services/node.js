import axios from "axios"

const base_url = "https://studies.cs.helsinki.fi/restcountries/api/"
const weather_url = "https://api.openweathermap.org/data/2.5/weather?"
const weather_api_key = import.meta.env.VITE_WEATHER_KEY

const getAll = async()=> {
    const url = base_url+"/all";
    const request = axios.get(url)
    return request.then(response=>response.data)
}

const getCountryByName = async(name) => {
    const url = base_url + `/name/${name}`
    const request = axios.get(url)
    return request.then(response=>response.data)
}

const getWeather = async([lat, lon]) => {
    const url = `${weather_url}lat=${lat}&lon=${lon}&units=metric&appid=${weather_api_key}`
    const request = axios.get(url)
    return request.then(response=>response.data)
}

export default {
    getAll,
    getCountryByName,
    getWeather
}