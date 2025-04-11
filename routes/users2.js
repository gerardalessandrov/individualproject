const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users2");
const { body, validationResult } = require("express-validator");
const { isAuthenticated } = require("../middleware/authenthicate");
router.get("/", usersController.getAll);

router.get("/:id", usersController.getSingle);

router.post(
  "/",isAuthenticated,
  [
    body("card_number")
      .isLength({ min: 1 })
      .withMessage("Card number is required.")
      .isNumeric()
      .withMessage("Card number must be numeric."),
    body("cardholder_name")
      .isLength({ min: 1 })
      .withMessage("Cardholder name is required.")
      .isAlpha()
      .withMessage("Cardholder name must contain only letters."),
    body("expiration_date")
      .isLength({ min: 1 })
      .withMessage("Expiration date is required.")
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
      .withMessage("Expiration date must be in MM/YY format."),
    body("security_code")
      .isLength({ min: 1 })
      .withMessage("Security code is required.")
      .isNumeric()
      .withMessage("Security code must be numeric.")
      .isLength({ min: 3, max: 3 })
      .withMessage("Security code must be 3 digits."),
    body("issuer")
      .isLength({ min: 1 })
      .withMessage("Issuer is required.")
      .isAlpha()
      .withMessage("Issuer must contain only letters."),
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
    body("card_number")
      .isLength({ min: 1 })
      .withMessage("Card number is required.")
      .isNumeric()
      .withMessage("Card number must be numeric."),
    body("cardholder_name")
      .isLength({ min: 1 })
      .withMessage("Cardholder name is required.")
      .isAlpha()
      .withMessage("Cardholder name must contain only letters."),
    body("expiration_date")
      .isLength({ min: 1 })
      .withMessage("Expiration date is required.")
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
      .withMessage("Expiration date must be in MM/YY format."),
    body("security_code")
      .isLength({ min: 1 })
      .withMessage("Security code is required.")
      .isNumeric()
      .withMessage("Security code must be numeric.")
      .isLength({ min: 3, max: 3 })
      .withMessage("Security code must be 3 digits."),
    body("issuer")
      .isLength({ min: 1 })
      .withMessage("Issuer is required.")
      .isAlpha()
      .withMessage("Issuer must contain only letters."),
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

router.delete("/:id",isAuthenticated,usersController.deleteUser);
module.exports = router;
