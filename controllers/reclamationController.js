import Reclamations from "../models/Reclamations";

export const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamations.find();
    res.status(200).json({
      data: reclamations,
      status: true,
      message: "Reclamations recupérées",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
