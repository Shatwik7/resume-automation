import mongoose from "npm:mongoose";

const templateSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  url: { type: String, required: true },
  image_url: { type: String,required:true },
  title: { type: String, required: true },
});
console.log("Registering Template model");
export default mongoose.model("Template", templateSchema);
