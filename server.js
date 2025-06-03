import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { type } from "os";
import { timeStamp } from "console";

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/tdl-kunal-DB").then((conn) => {
  console.log("Connect to DB", conn.connection.host);
});

// schema
const taskSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 8 },
});

// collection : model
const Task = mongoose.model("task", taskSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Task.find({}).then((tasksFound) => {
    console.log(tasksFound);
    res.render("List", {
      title: "TO DO List",
      tasks: tasksFound.length > 0 ? tasksFound : "No Tasks Found",
    });
  });
});

app.post("/", (req, res) => {
  const taskText = req.body.new_item;

  const newTask = new Task({
    name: taskText,
  });

  newTask.save().then((savedTask) => {
    console.log(savedTask);
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log("server started on port : ", PORT);
});
