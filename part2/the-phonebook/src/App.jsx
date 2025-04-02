import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "123456" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchField, setSearchField] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const newPersons = persons.concat({ name: newName, phone: newPhone });
    setPersons(newPersons);
    setFilteredPersons(newPersons);
    setNewName("");
    setNewPhone("");
    setSearchField("")
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        searchField={searchField}
        setSearchField={setSearchField}
        setFilteredPersons={setFilteredPersons}
        persons={persons}
      />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newPhone={newPhone}
        setNewPhone={setNewPhone}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons}/>
    </div>
  );
};

export default App;
