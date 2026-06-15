const { v4: uuidv4 } = require("uuid");
const { read, write } = require("../helpers/fileHelper");

exports.createTask = (req, res) => {
  const { title, description } = req.body;
  const tasks = read("tasks.json");

  const newTask = {
    id: uuidv4(),
    title,
    description: description || "",
    status: "pending",
    userId: req.user.id,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  write("tasks.json", tasks);
  res.status(201).json(newTask);
};

exports.getMyTasks = (req, res) => {
  const tasks = read("tasks.json");
  const myTasks = tasks.filter((t) => t.userId === req.user.id);
  res.json(myTasks);
};

exports.updateTask = (req, res) => {
  const tasks = read("tasks.json");
  const index = tasks.findIndex(
    (t) => t.id === req.params.id && t.userId === req.user.id,
  );

  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks[index] = {
    ...tasks[index],
    ...req.body,
    id: tasks[index].id,
    userId: tasks[index].userId,
  };
  write("tasks.json", tasks);
  res.json(tasks[index]);
};

exports.deleteTask = (req, res) => {
  const tasks = read("tasks.json");
  const filtered = tasks.filter(
    (t) => !(t.id === req.params.id && t.userId === req.user.id),
  );

  if (filtered.length === tasks.length)
    return res.status(404).json({ message: "Task not found" });

  write("tasks.json", filtered);
  res.json({ message: "Task deleted" });
};
