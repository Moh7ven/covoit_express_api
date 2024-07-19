import mongoose from "mongoose";

const reclamationsSchema = mongoose.Schema({
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
  },
  type: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Reclamations = mongoose.model("Reclamations", reclamationsSchema);

export default Reclamations;
