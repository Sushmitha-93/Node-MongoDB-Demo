const mongoose = require("mongoose");

// 1. Connect to database
mongoose
  .connect("mongodb://localhost/playground", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB..", err));

// 2. Schema
const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

// 3. Model
const Course = mongoose.model("Course", courseSchema); // (CollectionName,Schema) //Class (Note: Mongoose automatically looks for the plural, lowercased version of your model name)

async function createCourse() {
  // 4. Create object of model class
  const course = new Course({
    name: "Chat Bot",
    author: "Sushmitha",
    tags: ["chat-bot", "application"],
    isPublished: true
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function getCoursesByFiltering() {
  const courses = await Course.find({
    author: "Sushmitha",
    isPublished: true
  })
    .sort({ name: 1 })
    .limit(5)
    .select(["name", "tags"]);

  console.log(courses);
  console.log("Count:", courses.length); // or use count() of Course model
}
/* COMPARISON OPERATION
-Since each object is nothing but Key:Value pair in JS, and value must be definite, 
  we can use another object in place of value and give lt/gt ...as key to it
-we use "$" to indicate its an operator.
-eq,neq,lt,lte,gt,gte,in,nin

async function getCourseByComparisionOp(){
  const priceComparison=await Course.find({price:{ $lt:10 }})
  const priceOptions=await Course.find({price:{ $in:[10,15,20] }})
}*/

// LOGICAL OPERATION
async function getCoursesByLogicalOp() {
  const courses = await Course.find().or([
    { author: "Sushmitha" },
    { author: "Sush" }
  ]);
  console.log(courses);
}

async function getCoursesByRegExp() {
  const courses = await Course.find({
    author: /^Sush/
  });
  console.log(courses);
}

//createCourse();
//getCourses();
//getCoursesByFiltering();
//getCoursesByLogicalOp();
getCoursesByRegExp();
