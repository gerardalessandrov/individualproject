const router = require("express").Router();
router.use("/", require("./swagger"));
router.get("/", (req, res) => {
  res.send("Hello World");
});
router.use("/users", require("./users"));
router.use("/users2", require("./users2"));

module.exports = router;
