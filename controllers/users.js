const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Obtener todos los usuarios
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
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener un solo usuario por ID
const getSingle = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validación del ID de MongoDB
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .find({ _id: new ObjectId(userId) });

    result.toArray().then((contacts) => {
      if (contacts.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(contacts[0]);
    });
  } catch (err) {
    console.error("Error al obtener el usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { name, lastname, gmail, phonenumber, birthday, facebook, instagram } =
    req.body;

  // Validación de campos requeridos
  if (
    !name ||
    !lastname ||
    !gmail ||
    !phonenumber ||
    !birthday ||
    !facebook ||
    !instagram
  ) {
    return res.status(400).json({ message: "Campos requeridos faltantes." });
  }

  // Validación de formato de correo electrónico
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(gmail)) {
    return res
      .status(400)
      .json({ message: "Formato de correo electrónico inválido." });
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
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  } catch (err) {
    console.error("Error al crear el usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  const userId = req.params.id;

  // Validación del ID de MongoDB
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }

  const { name, lastname, gmail, phonenumber, birthday, facebook, instagram } =
    req.body;

  // Validación de campos requeridos
  if (
    !name ||
    !lastname ||
    !gmail ||
    !phonenumber ||
    !birthday ||
    !facebook ||
    !instagram
  ) {
    return res.status(400).json({ message: "Campos requeridos faltantes." });
  }

  // Validación de formato de correo electrónico
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(gmail)) {
    return res
      .status(400)
      .json({ message: "Formato de correo electrónico inválido." });
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
      .replaceOne({ _id: new ObjectId(userId) }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send(); // Usuario actualizado correctamente
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Validación del ID de MongoDB
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }

  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .deleteOne({ _id: new ObjectId(userId) });

    if (response.deletedCount > 0) {
      res.status(204).send(); // Usuario eliminado correctamente
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error al eliminar el usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
