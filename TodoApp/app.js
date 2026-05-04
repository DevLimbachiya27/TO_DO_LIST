const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let tasks = [
  { id: 1, title: "Prepare Report", description: "Complete weekly project report", priority: "High", status: "Pending" },
  { id: 2, title: "Team Meeting", description: "Attend daily standup with the dev team", priority: "Medium", status: "In Progress" },
  { id: 3, title: "Code Review", description: "Review pull requests from junior developers", priority: "High", status: "Completed" },
];

let nextId = 4;

function getStats() {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
  };
}

app.get("/", (req, res) => {
  res.render("dashboard", { tasks, stats: getStats(), message: null });
});

app.get("/add-task", (req, res) => {
  res.render("add-task", { error: null });
});

app.post("/add-task", (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.render("add-task", { error: "All fields are required." });
  }
  tasks.push({ id: nextId++, title, description, priority, status: "Pending" });
  res.redirect("/");
});

app.get("/edit-task/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.redirect("/");
  res.render("edit-task", { task, error: null });
});

app.post("/edit-task/:id", (req, res) => {
  const { title, description, priority, status } = req.body;
  if (!title || !description || !priority || !status) {
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    return res.render("edit-task", { task, error: "All fields are required." });
  }
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.status = status;
  }
  res.redirect("/");
});

app.post("/delete-task/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.redirect("/");
});

app.post("/status/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    if (task.status === "Pending") task.status = "In Progress";
    else if (task.status === "In Progress") task.status = "Completed";
  }
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
