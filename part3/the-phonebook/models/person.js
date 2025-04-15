const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to ", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}=\d+$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number! Format must be XX-XXXXXXX or XXX-XXXXXXXX.`,
    }
  }
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Add a user-friendly 'id' field
    delete returnedObject._id; // Remove the MongoDB-specific '_id'
    delete returnedObject.__v; // Remove the version key
  },
});

module.exports = mongoose.model("Person", phonebookSchema);
