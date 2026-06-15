const router = require("express").Router();
const { protect } = require("../middleware/auth");
const ctrl = require("../controllers/taskController");
router.use(protect);
router.get("/", ctrl.getMyTasks);
router.post("/", ctrl.createTask);
router.put("/:id", ctrl.updateTask);
router.delete("/:id", ctrl.deleteTask);
module.exports = router;
