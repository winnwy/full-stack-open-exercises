const Filter = ({
  searchField,
  setSearchField,
  setFilteredPersons,
  persons,
}) => {
  return (
    <div>
      filter shown with
      <input
        value={searchField}
        onChange={(e) => {
          const newSearch = e.target.value;
          setSearchField(newSearch);
          setFilteredPersons(
            persons.filter((person) =>
              person.name.toLowerCase().includes(newSearch.toLowerCase())
            )
          );
        }}
      />
    </div>
  );
};

export default Filter;
