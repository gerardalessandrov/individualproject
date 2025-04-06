const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .find();
    result.toArray().then((contacts) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(contacts);
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching users." });
  }
};

const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);

  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .find({ _id: userId });

    result.toArray().then((contacts) => {
      if (contacts.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(contacts[0]);
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user." });
  }
};

const createUser = async (req, res) => {
  const { name, lastname, gmail, phonenumber, birthday, facebook, instagram } =
    req.body;

  // Validación de campos requeridos
  if (!name || !lastname || !gmail || !phonenumber || !birthday) {
    return res.status(400).json({
      message:
        "Fields 'name', 'lastname', 'gmail', 'phonenumber', and 'birthday' are required.",
    });
  }

  const user = {
    name,
    lastname,
    gmail,
    phonenumber,
    birthday,
    facebook,
    instagram,
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .insertOne(user);

    if (response.acknowledged) {
      res.status(201).send(); // Usuario creado correctamente
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while creating the user." });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the user." });
  }
};

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const { name, lastname, gmail, phonenumber, birthday, facebook, instagram } =
    req.body;

  // Validación de campos requeridos
  if (!name || !lastname || !gmail || !phonenumber || !birthday) {
    return res.status(400).json({
      message:
        "Fields 'name', 'lastname', 'gmail', 'phonenumber', and 'birthday' are required.",
    });
  }

  const user = {
    name,
    lastname,
    gmail,
    phonenumber,
    birthday,
    facebook,
    instagram,
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send(); // Usuario actualizado correctamente
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user." });
  }
};

const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(204).send(); // Usuario eliminado correctamente
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
