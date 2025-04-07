const Persons = ({filteredPersons, deleteHandler}) => {
    return ( <table>
        <tbody>
          {filteredPersons.length > 0 ? (
            filteredPersons.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.number}</td>
                <td> <button onClick={()=>deleteHandler(person.id)}>delete</button></td>
              </tr>
            )
            )
          ) : (
            <tr>
              <td>No contacts found</td>
            </tr>
          )}
        </tbody>
      </table> );
}
 
export default Persons;