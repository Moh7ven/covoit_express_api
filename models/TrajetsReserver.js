import mongoose from "mongoose";

const trajetReserverSchema = mongoose.Schema({
  idTrajet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trajets",
  },
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
  },
  date: { type: String, required: true },
  heure: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const TrajetsReserver = mongoose.model("TrajetsReserver", trajetReserverSchema);

export default TrajetsReserver;
