import fs from  "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";
const backend_url = "http://localhost:3000";
const templatesFolder = "../template"; // Folder containing the templates

async function seedTemplates() {
  const files = fs.readdirSync(templatesFolder);
  
  for (const file of files) {
    if (file.endsWith(".ejs")) {
      const ejsPath = path.join(templatesFolder, file);
      const imgPath = path.join(templatesFolder, file.replace(".ejs", ".jpeg"));

      if (!fs.existsSync(imgPath)) {
        console.warn(`Skipping ${file}: No matching image found.`);
        continue;
      }

      const formData = new FormData();
      formData.append(
        "ejsFile",
        fs.createReadStream(ejsPath),
        file
      );
      formData.append(
        "imageFile",
        fs.createReadStream(imgPath),
        file.replace(".ejs", ".png")
      );
      formData.append("title", file.replace(".ejs", ""));

      try {
        const response = await fetch(`${backend_url}/api/templates`, {
          method: "POST",
          body: formData,
          headers: formData.getHeaders(),
        });
      
        const text = await response.text(); // Get raw response text
        console.log(`✅ Uploaded: ${file} → ${text}`);
      } catch (error) {
        console.error(`❌ Error uploading ${file}:`, error.message);
      }
      
    }
  }
}

seedTemplates();
