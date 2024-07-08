import Client from "../models/Clients.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createClient = async (req, res) => {
  const { nom, prenom, email, tel, password } = req.body;
  try {
    if (!nom || !prenom || !email || !tel || !password) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    // Verifier si l'utilisateur existe
    const user = await Client.findOne({ $or: [{ email }, { tel }] });
    if (user) {
      return res.status(400).json({
        message: "Cet utilisateur existe deja !",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await Client.create({
      nom,
      prenom,
      email,
      tel,
      password: hashedPassword,
    });
    res.status(201).json({
      data: client,
      status: true,
      message: "Utilisateur creé avec succès  !",
    });
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
