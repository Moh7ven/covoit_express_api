import Client from "../models/Clients.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Trajets from "../models/Trajets.js";
import Conducteurs from "../models/Conducteur.js";
import verifImmatricule from "../utils/immatricule.js";
import permisVerif from "../utils/permisVerif.js";

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

export const loginClient = async (req, res) => {
  try {
    const { tel, password } = req.body;

    if (!tel || !password) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    const client = await Client.findOne({ tel });
    if (!client) {
      return res.status(400).json({
        message: "Cet utilisateur n'existe pas !",
        status: false,
      });
    }

    const { nom, prenom, email } = client;

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mot de passe incorrect !",
        status: false,
      });
    }

    const token = jwt.sign({ clientId: client._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({
      data: { nom, prenom, email },
      token,
      status: true,
      message: "Connexion reussie !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getUserConnected = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    if (!clientId) {
      return res
        .status(401)
        .json({ message: "Vous n'etes pas autorisé", status: false });
    }
    const client = await Client.findById(clientId);
    if (!client) {
      return res
        .status(404)
        .json({ message: "Vous n'êtes pas autoriser", status: false });
    }
    res.status(200).json({ data: client, status: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const clientId = req.auth.clientId;

    const client = await Client.findByIdAndUpdate(clientId, req.body, {
      new: true,
    });
    res.status(200).json({
      data: client,
      message: "Utilisateur mis à jour !",
      status: true,
    });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const addTrajet = async (req, res) => {
  try {
    const { date, heure, lieuDepart, lieuArrivee, distance, cout, note } =
      req.body;
    const clientId = req.auth.clientId;
    const client = await Client.findById(clientId);

    if (!date || !heure || !lieuDepart || !lieuArrivee || !distance || !cout) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }
    const trajet = await Trajets.create({
      idConducteur: clientId,
      idClient: clientId,
      date,
      heure,
      lieuDepart,
      lieuArrivee,
      distance,
      cout,
      note,
    });
    res.status(201).json({
      data: trajet,
      status: true,
      message: "Trajet ajouter avec succes !",
    });
  } catch (error) {
    res.status(404).json({ message: error.message, status: false });
  }
};

export const saveAsConducteur = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const client = await Client.findById(clientId);
    const { immatriculation, permis, vehicule, nombrePlace } = req.body;
    if (!immatriculation || !permis || !vehicule || !nombrePlace) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    if (verifImmatricule(immatriculation) === false) {
      return res.status(400).json({
        message: "Immatriculation invalide !",
        status: false,
      });
    }

    if (permisVerif(permis) === false) {
      return res.status(400).json({
        message: "Permis invalide !",
        status: false,
      });
    }

    if (!client) {
      return res.status(400).json({
        message: "Utilisateur inexistant!",
        status: false,
      });
    }

    const conducteur = {
      idConducteur: clientId,
      immatriculation,
      permis,
      vehicule,
      nombrePlace,
    };

    const newConducteur = await Conducteurs.create(conducteur);
    res.status(201).json({
      data: newConducteur,
      status: true,
      message: "Conducteur ajouter avec succes !",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};

export const getConducteurForClient = async (req, res) => {
  try {
    const clientId = req.auth.clientId;
    const conducteur = await Conducteurs.findOne({ idConducteur: clientId });
    res.status(200).json({ data: conducteur, status: true });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ message: "Une erreur s'est produite", status: false });
  }
};
