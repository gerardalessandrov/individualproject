const passport = require("passport");
const router = require("express").Router();
router.use("/", require("./swagger"));
router.get("/", (req, res) => {
  res.send("Logged out");
});
router.use("/users", require("./users"));
router.use("/users2", require("./users2"));
router.get("/login", passport.authenticate("github"), (req, res) => {});
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
