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

    // Verifier la taille du mot de passe
    if (password.length < 8 || password.length > 10) {
      return res.status(400).json({
        message: "Le mot de passe doit être entre 8 et 10 caractères",
        status: false,
      });
    }

    // verifier la taille du tel
    if (tel.length !== 10) {
      return res.status(400).json({
        message: "Le numéro de tel doit être de 10 caractères",
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
    res.status(500).json({ message: error.message });
  }
};
