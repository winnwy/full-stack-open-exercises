import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phoneService from "./services/node";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [searchField, setSearchField] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });

  useEffect(() => {
    phoneService.getAll().then((allPersons) => {
      setPersons(allPersons);
      setFilteredPersons(allPersons);
    });
  }, []);

  const addPerson = (name, number) => {
    const newObject = { name, number };
    phoneService
      .create(newObject)
      .then((returnedPerson) => {
        const updatedPersons = persons.concat(returnedPerson);
        setPersons(updatedPersons);
        setFilteredPersons(updatedPersons);
        setNotification({ message: `Added ${newName}`, type: "success" });
        setTimeout(() => {
          setNotification({ message: null, type: "" });
        }, 5000);
        setNewName("");
        setNewPhone("");
        setSearchField("");
      })
      .catch((error) => {
        setNotification({
          message: `Failed to add ${newName}`,
          type: "error",
        });
        setTimeout(() => {
          setNotification({ message: null, type: "" });
        }, 5000);
      });
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
          setNotification({
            message: `Deleted ${personToDelete.name}`,
            type: "success",
          });
          setTimeout(() => {
            setNotification({ message: null, type: "" });
          }, 5000);
        })
        .catch((err) => {
          setNotification({
            message: `Failed to delete ${personToDelete.name}`,
            type: "error",
          });
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
            setNotification({
              message: `Updated ${newName}`,
              type: "success",
            });
            setTimeout(() => {
              setNotification({ message: null, type: "" });
            }, 5000);
            setNewName("");
            setNewPhone("");
            setSearchField("");
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setNotification({
                message: `${newName} has been deleted, so their number cannot be updated.`,
                type: "error",
              });
            }else {
              setNotification({
                message: `Failed to update ${newName}`,
                type: "error",
              });
            }
            setTimeout(() => {
              setNotification({ message: null, type: "" });
            }, 5000);
            console.error(error);
          });
      }
      return;
    }
    addPerson(newName, newPhone);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
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
