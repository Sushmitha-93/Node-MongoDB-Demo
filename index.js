const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB..", err));

//Schema
const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

async function createCourse() {
  //Model
  const Course = mongoose.model("Course", courseSchema); // (CollectionName,Schema)
  const course = new Course({
    name: "Node",
    author: "Sushmitha",
    tags: ["node", "backend"],
    isPublished: false
  });

  const result = await course.save();
  console.log(result);
}

createCourse();
