const backend_url = "http://localhost:3000";
jest.setTimeout(30000); 
describe("Template CRUD", () => {
    let templateId="";
    test("Creating new Template",async ()=>{
      const formData = new FormData();
      formData.append("ejsFile", new Blob(["<html></html>"], { type: "text/plain" }), "template.ejs");
      formData.append("imageFile", new Blob(["image-data"], { type: "image/png" }), "preview.png");
      formData.append("title", "Sample Template");
      const response =await fetch(`${backend_url}/api/templates`, {
        method: "POST",
        body: formData,
      })
      const data=await response.json();
      expect(response.status).toBe(201);
      templateId=data._id;
    })
  
    test("Updating the Template", async () => {
      const formData = new FormData();
      formData.append("title", "NewTemplate");
      const response = await fetch(`${backend_url}/api/templates/${templateId}`, {
        method: "PUT",
        body: formData,
      });
      expect(response.status).toBe(200);
    });
  
    test("Reading the Template", async () => {
      console.log(templateId);
      const response = await fetch(`${backend_url}/api/templates/${templateId}`, {
        method: "GET",
      });
      const data = await response.json().catch(() => null);
      expect(response.status).toBe(200);
      expect(data).not.toBeNull();
    });
  
    test("Delete the template", async () => {
      console.log(templateId);
      const response = await fetch(`${backend_url}/api/templates/${templateId}`, {
        method: "DELETE",
      });
      expect(response.status).toBe(200);
    });
  });
  