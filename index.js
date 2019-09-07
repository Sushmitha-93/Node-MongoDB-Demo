const mongoose = require("mongoose");

// 1. CONNECT TO DATABASE
mongoose
  .connect("mongodb://localhost/playground", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB..", err));

// 2. SCHEMA
const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // 'required' Validator
    minlength: 5,
    maxlength: 20
    //match:/patern/
  },
  author: String,
  tags: {
    type: [String],
    enum: ["web", "front-end", "back-end"], // 'enum' Validator
    //Custom Validator
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "Course should have atleast one tag"
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: {
      // using function. Arrow function don't work because this will access different object.
      function() {
        return this.isPublished;
      }
    }
  }
});

// 3. MODEL for schema
const Course = mongoose.model("Course", courseSchema); // (CollectionName,Schema) //Class (Note: Mongoose automatically looks for the plural, lowercased version of your model name)

async function createCourse() {
  // 4. CREATE OBJECT OF MODEL CLASS
  const course = new Course({
    name: "Mongoose",
    author: "Sushmitha",
    tags: ["back-end"],
    isPublished: true,
    price: 15
  });

  //Catch and display the validation error
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    // console.log("Exception: ", ex.message);
    for (i in ex.errors) console.log(ex.errors[i].message); //see 'errors' object for more info
  }
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

// UPDATE by query first approach:
// 1) Query for ID, find()    2) Update properties   3) save()
async function updateById1(id) {
  const course = await Course.findById(id);
  if (!course) return;

  course.author = "John";
  course.isPublished = false;

  const result = await course.save();
  console.log(result);
}

// UPDATE using MongoDB update operator approach:
// 1) Update directly 2) Optionally get updated document
async function updateById2(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: { author: "Lily", isPublished: true }
    },
    { new: true } //returns new updated document object
  );
  console.log(course);
}

// DELETE
// 1) Course.deleteOne({_id:id})   2) Course.deleteMany({_id:id})
// 3) Course.findByIdAndDelete(id)  -- Returns deleted document Object
async function deleteById(id) {
  const course = await Course.findByIdAndDelete(id);
  console.log(course);
}

// function calls -
createCourse();
//getCourses();
//getCoursesByFiltering();
//getCoursesByLogicalOp();
//getCoursesByRegExp();
// updateById1("5d6a212fafb66307bc453947");
// updateById2("5d6a212fafb66307bc453947");
//deleteById("5d6a212fafb66307bc453947");
