import mongoose from "mongoose";

const conducteurSchema = mongoose.Schema({
  idConducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
  },
});
