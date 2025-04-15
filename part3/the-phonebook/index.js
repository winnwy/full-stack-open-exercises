require('dotenv').config()
const express = require("express");
const Person = require('./models/person')
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static('dist'))

morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  Person.find({}).then(
    persons=>{
      response.json(persons)
    }
  )
});

app.get("/info", (request, response) => {
  Person.countDocuments({}).then(count => {
    const currentDate = new Date();
    response.send(
      `<p>Phonebook has info for ${data.length} people</p><p>${currentDate}<p>`
    );
  }).catch(error => {
    console.error("Error fetching info:", error);
    response.status(500).send("Error retrieving phonebook information");
  });

});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then(
    (person)=>{
      response.json(person)
    }
  ).catch(error => {
    console.error("Error fetching person:", error);
    response.status(500).send("Error retrieving person");
  })

});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const personIndex = data.findIndex((person) => person.id === id);

  Person.findByIdAndDelete(id).then(
  (result)=>{
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).send({ error: "Person not found" });
    }
  }
  )
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  Person.findOne({ name: new RegExp(`^${name}$`, 'i') }) // case-insensitive
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: "name already exists" });
      }

      const person = new Person({ name, number });

      person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const {name, number} = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(id, updatedPerson,  { new: true, runValidators: true, context: 'query' }) .then(result => {
    if (result) {
      response.json(result);
    } else {
      response.status(404).json({ error: "person not found" });
    }
  })
  .catch(error => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
