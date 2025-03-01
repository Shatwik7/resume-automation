const backend_url = "http://localhost:3000";

describe("USER CRUD", () => {
    let token = "";
    const user = {
      name: `testUser${Math.floor(Math.random() * 100000)}`, // Random name
      phno: "1234567890",
      password: "12345678",
      email: `testUser${Math.floor(Math.random() * 100000)}@gmail.com`, // Random email
      city: "New York", // Use a fixed value or create a random city function
      linkdin: "https://linkedin.com/in/testuser",
      github: "https://github.com/shatwik7",
      education: [
        {
          college_name: "Harvard University",
          major: "Computer Science",
          starting: "09/2015",
          ending: "06/2019",
          gpa: 3.8,
        },
      ],
    };
    test("Create User", async () => {
        const response = await fetch(backend_url + "/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(user),
        });
  
        const data = await response.json();
        expect(response.status).toBe(201);
        expect(data).toHaveProperty("token");
        token = data.token;
    });
  
    test("READ user", async () => {
      const response = await fetch(backend_url + "/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("name");
      expect(data).toHaveProperty("email");
    });
  
    test("Trying to get /me without token", async () => {
      const response = await fetch(backend_url + "/api/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      expect(response.status).toBe(401);
    });
  
    test("Update the User Information", async () => {
      const response = await fetch(backend_url + "/api/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          city: "Delhi",
        }),
      });
  
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("city");
      expect(data.city).toBe("Delhi");
    });
  
    test("Delete the User", async () => {
      const response = await fetch(backend_url + "/api/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      expect(response.status).toBe(200);
    });
  
    test("Deleting the Deleted User / non existing user", async () => {
      const response = await fetch(backend_url + "/api/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      expect(response.status).toBe(404);
    });
    
  });
  