import axios from "axios"

const base_url = "https://studies.cs.helsinki.fi/restcountries/api/"

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

export default {
    getAll,
    getCountryByName,
}