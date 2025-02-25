import mongoose from "npm:mongoose";

const educationSchema = new mongoose.Schema({
  college_name: String,
  major: String,
  starting: String,
  ending: String,
  gpa: Number,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phno: String,
  hashPassword:{type:String, required:true},
  city: String,
  email: { type: String, required: true },
  linkdin: String,
  github: String,
  education: [educationSchema],
  resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
});
console.log("Registering User model");
export default mongoose.model("User", userSchema);
