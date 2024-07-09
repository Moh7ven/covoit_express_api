import mongoose from "mongoose";

const trajetSchema = mongoose.Schema({
  idConducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conducteurs",
  },
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
  },
  idLocalite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Localites",
  },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  lieuDepart: { type: String, required: true },
  lieuArrivee: { type: String, required: true },
  distance: { type: Number, required: false },
  cout: { type: Number, required: true },
});

const Trajets = mongoose.model("Trajets", trajetSchema);

export default Trajets;
