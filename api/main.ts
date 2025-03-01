import app from "./app.ts";
import mongoose from "npm:mongoose";
import "jsr:@std/dotenv/load";

const PORT = Deno.env.get("PORT") || 3000;
const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://localhost:27017/resumeBuilder";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
