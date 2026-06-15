const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/adminController");
router.use(protect, adminOnly);
router.get("/tasks", ctrl.getAllTasks);
router.get("/users", ctrl.getAllUsers);
router.put("/tasks/:id", ctrl.updateAnyTask);
router.delete("/tasks/:id", ctrl.deleteAnyTask);
module.exports = router;
