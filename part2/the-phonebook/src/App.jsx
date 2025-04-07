import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phoneService from "./services/node";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchField, setSearchField] = useState("");

  useEffect(() => {
    phoneService.getAll().then((allPersons) => {
      setPersons(allPersons);
      setFilteredPersons(allPersons);
    });
  }, []);

  const addPerson = (name, number) => {
    const newObject = { name, number };
    phoneService.create(newObject);
  };

  const deleteHandler = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (!personToDelete) return;

    if (
      window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)
    ) {
      phoneService
        .deleteOne(id)
        .then(() => {
          const updated = persons.filter((p) => p.id !== id);
          setPersons(updated);
          setFilteredPersons(updated);
          setSearchField("");
        })
        .catch((err) => {
          alert(`Failed to delete ${personToDelete.name}`);
          console.error(err);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingPerson = persons.find((p) => p.name === newName);
    if (existingPerson !== undefined) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newPhone };
        phoneService
          .updatePerson(updatedPerson)
          .then((returnedPerson) => {
            const updatedPersons = persons.map((p) =>
              p.id !== existingPerson.id ? p : returnedPerson
            );
            setPersons(updatedPersons);
            setFilteredPersons(updatedPersons);
            setNewName("");
            setNewPhone("");
            setSearchField("");
          })
          .catch((error) => {
            alert(`Failed to update ${newName}`);
            console.error(error);
          });
      }
      return;
    }
    addPerson(newName, newPhone);
    const newPersons = persons.concat({ name: newName, number: newPhone });
    setPersons(newPersons);
    setFilteredPersons(newPersons);
    setNewName("");
    setNewPhone("");
    setSearchField("");
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
      <Persons
        filteredPersons={filteredPersons}
        deleteHandler={deleteHandler}
      />
    </div>
  );
};

export default App;
