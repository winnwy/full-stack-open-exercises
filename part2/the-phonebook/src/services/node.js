import axios from "axios";

const base_url = "/api/persons";

const getAll = async () => {
  const request = axios.get(base_url);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const request = axios.post("/info", newObject);
  return request.then((response) => response.data);
};

const deleteOne = async (id) => {
  return axios.delete(base_url + id);
};

const updatePerson = async (newPerson) => {
  const request = axios.put(base_url + newPerson.id, newPerson);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  deleteOne,
  updatePerson,
};
