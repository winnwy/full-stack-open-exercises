require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
const morgan = require("morgan");
const app = express();

app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const currentDate = new Date();
      response.send(
        `<p>Phonebook has info for ${count} people</p><p>${currentDate}<p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id).then((result) => {
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).send({ error: "Person not found" });
    }
  });
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        existingPerson.number = number;
        return existingPerson.save().then((updatedPerson) => {
          response.json(updatedPerson);
        });
      }

      // ➕ Create new if not found
      const person = new Person({ name, number });
      person
        .save()
        .then((savedPerson) => response.json(savedPerson))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(id, updatedPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({ error: "person not found" });
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use((error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
