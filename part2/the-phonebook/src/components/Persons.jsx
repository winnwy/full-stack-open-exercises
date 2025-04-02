const Persons = ({filteredPersons}) => {
    return ( <table>
        <tbody>
          {filteredPersons.length > 0 ? (
            filteredPersons.map((person) => (
              <tr key={person.name}>
                <td>{person.name}</td>
                <td>{person.phone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No contacts found</td>
            </tr>
          )}
        </tbody>
      </table> );
}
 
export default Persons;