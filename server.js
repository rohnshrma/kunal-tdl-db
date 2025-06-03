import express from "express";
// Imports the Express framework for building web applications and APIs

import bodyParser from "body-parser";
// Imports the body-parser middleware to parse incoming request bodies (e.g., form data)

import mongoose from "mongoose";
// Imports Mongoose, an ODM (Object Data Modeling) library for MongoDB to interact with the database

import { type } from "os";
// Imports the 'type' function from the Node.js 'os' module (though it appears unused in this code)

import { timeStamp } from "console";
// Imports the 'timeStamp' function from the Node.js 'console' module (though it appears unused in this code)

const app = express();
// Creates an instance of an Express application

const PORT = 3000;
// Defines the port number (3000) where the server will listen for requests

mongoose.connect("mongodb://localhost:27017/tdl-kunal-DB").then((conn) => {
  // Connects to a MongoDB database running locally on port 27017, using the database named 'tdl-kunal-DB'
  console.log("Connect to DB", conn.connection.host);
  // Logs a success message with the database host (e.g., 'localhost') when the connection is established
});

// schema
const taskSchema = mongoose.Schema({
  // Defines a Mongoose schema for the 'Task' collection
  name: { type: String, required: true, minLength: 8 },
  // Specifies that each task has a 'name' field, which is a required string with a minimum length of 8 characters
});

// collection : model
const Task = mongoose.model("task", taskSchema);
// Creates a Mongoose model named 'task' based on the taskSchema, representing the 'task' collection in MongoDB

app.use(express.static("public"));
// Serves static files (e.g., CSS, images, client-side JS) from the 'public' directory

app.use(bodyParser.urlencoded({ extended: true }));
// Configures body-parser middleware to parse URL-encoded form data (e.g., from HTML forms)
// `extended: true` allows parsing of nested objects in the request body

app.set("view engine", "ejs");
// Sets EJS (Embedded JavaScript) as the template engine for rendering dynamic HTML views

app.get("/", (req, res) => {
  // Defines a route handler for GET requests to the root URL ('/')
  Task.find({}).then((tasksFound) => {
    // Queries the MongoDB 'task' collection to retrieve all tasks
    console.log(tasksFound);
    // Logs the retrieved tasks to the console for debugging
    res.render("List", {
      // Renders the 'List' EJS template (e.g., List.ejs)
      title: "TO DO List",
      // Passes a 'title' variable with the value "TO DO List" to the template
      tasks: tasksFound.length > 0 ? tasksFound : "No Tasks Found",
      // Passes a 'tasks' variable: if tasks are found, sends the array of tasks; otherwise, sends the string "No Tasks Found"
    });
  });
});

app.post("/", (req, res) => {
  // Defines a route handler for POST requests to the root URL ('/')
  const taskText = req.body.new_item;
  // Extracts the 'new_item' field from the request body (from the form input with name="new_item")

  const newTask = new Task({
    // Creates a new Task document based on the Task model
    name: taskText,
    // Sets the 'name' field of the new task to the submitted form input
  });

  newTask.save().then((savedTask) => {
    // Saves the new task to the MongoDB database
    console.log(savedTask);
    // Logs the saved task to the console for debugging
    res.redirect("/");
    // Redirects the user to the root URL ('/'), which triggers the GET route to display the updated task list
  });
});

app.listen(PORT, () => {
  // Starts the Express server, listening for requests on the specified PORT (3000)
  console.log("server started on port : ", PORT);
  // Logs a message to the console when the server starts successfully
});
