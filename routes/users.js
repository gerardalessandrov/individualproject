const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const { body, validationResult } = require("express-validator");
const { isAuthenticated } = require("../middleware/authenthicate");
router.get("/", usersController.getAll);

router.get("/:id", usersController.getSingle);

// POST route to create a new user with validations
router.post(
  "/",isAuthenticated,
  [
    body("name").isLength({ min: 1 }).withMessage("Name is required."),
    body("lastname").isLength({ min: 1 }).withMessage("Lastname is required."),
    body("gmail").isEmail().withMessage("A valid email address is required."),
    body("phonenumber")
      .isMobilePhone()
      .withMessage("A valid phone number is required."),
    body("birthday").isDate().withMessage("A valid birthdate is required."),
    // Add more validations as needed
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  usersController.createUser
);

// PUT route to update an existing user with validations
router.put(
  "/:id",isAuthenticated,
  [
    body("name").isLength({ min: 1 }).withMessage("Name is required."),
    body("lastname").isLength({ min: 1 }).withMessage("Lastname is required."),
    body("gmail").isEmail().withMessage("A valid email address is required."),
    body("phonenumber")
      .isMobilePhone()
      .withMessage("A valid phone number is required."),
    body("birthday").isDate().withMessage("A valid birthdate is required."),
    // Add more validations as needed
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  usersController.updateUser
);

router.delete("/:id",isAuthenticated, usersController.deleteUser);
module.exports = router;
