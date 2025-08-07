import mongoose from "mongoose";

const collSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
})

const Coll =mongoose.models.Coll || mongoose.model("Coll", collSchema);

export default Coll;