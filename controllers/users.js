const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection("contacts").find();
  result.toArray().then((contacts) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts);
  });
};

const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDatabase()
    .db()
    .collection("contacts")
    .find({ _id: userId });
  result.toArray().then((contacts) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts[0]);
  });
};
const createUser = async (req, res) => {
  const user = {
    name: req.body.name,
    lastname: req.body.lastname,
    gmail: req.body.gmail,
    phonenumber: req.body.phonenumber,
    birthday: req.body.birthday,
    facebook: req.body.facebook,
    instagram: req.body.instagram
  };
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
      .json(response.error || "Some error occurred while creating the user");
  }
};

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const user = {
    name: req.body.name,
    lastname: req.body.lastname,
    gmail: req.body.gmail,
    phonenumber: req.body.phonenumber,
    birthday: req.body.birthday,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
  };
  const response = await mongodb
    .getDatabase()
    .db()
    .collection("contacts")
    .replaceOne({ _id: userId }, user);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error ocurred while updating the user");
  }
};
const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDatabase()
    .db()
    .collection("contacts")
    .deleteOne({ _id: userId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error ocurred while updating the user");
  }
};
module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
