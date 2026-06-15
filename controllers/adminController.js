const { read, write } = require("../helpers/fileHelper");

exports.getAllTasks = (req, res) => {
  const tasks = read("tasks.json");
  const users = read("users.json");

  const enriched = tasks.map((t) => {
    const user = users.find((u) => u.id === t.userId);
    return { ...t, userName: user?.name, userEmail: user?.email };
  });

  res.json(enriched);
};

exports.getAllUsers = (req, res) => {
  const users = read("users.json");
  const safe = users.map(({ password, ...rest }) => rest);
  res.json(safe);
};

exports.updateAnyTask = (req, res) => {
  const tasks = read("tasks.json");
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks[index] = { ...tasks[index], ...req.body, id: tasks[index].id };
  write("tasks.json", tasks);
  res.json(tasks[index]);
};

exports.deleteAnyTask = (req, res) => {
  const tasks = read("tasks.json");
  const filtered = tasks.filter((t) => t.id !== req.params.id);

  if (filtered.length === tasks.length)
    return res.status(404).json({ message: "Task not found" });

  write("tasks.json", filtered);
  res.json({ message: "Task deleted by admin" });
};
