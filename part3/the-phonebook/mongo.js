const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://winnwyz:${password}@cluster0.k14cijy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

// Case: show phonebook
if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person.find({})
    .then(persons => {
      persons.forEach(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  // Case: add a new person
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Usage:')
  console.log('  node mongo.js <password>                # list all')
  console.log('  node mongo.js <password> <name> <number>  # add new')
  process.exit(1)
}