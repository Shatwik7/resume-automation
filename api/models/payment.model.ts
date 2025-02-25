import mongoose from "npm:mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subscriptionPlan: String,
  paymentMethod: String,
  amount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
});
console.log("Registering Payment model");
export default mongoose.model("Payment", paymentSchema);
