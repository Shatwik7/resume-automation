import mongoose from "npm:mongoose";

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url : String,
  status: { 
    type: String, 
    enum: ["pending", "processing", "completed", "failed"], 
    default: "pending"
  },
  selected_repo :[String],
  template:{type :mongoose.Schema.Types.ObjectId ,ref:"Template"}
},
{ timestamps: true });
console.log("Registering Resume model");
export default mongoose.model("Resume", resumeSchema);
