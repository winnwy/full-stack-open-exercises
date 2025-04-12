const express = require("express");
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
  response.json(data);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(
    `<p>Phonebook has info for ${data.length} people</p><p>${currentDate}<p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = data.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const personIndex = data.findIndex((person) => person.id === id);

  if (personIndex !== -1) {
    data.splice(personIndex, 1);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  if (
    data.find((person) => person.name.toLowerCase() === body.name.toLowerCase())
  ) {
    return response.status(400).json({
      error: "name already exists",
    });
  }

  const generateId = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  data.push(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
