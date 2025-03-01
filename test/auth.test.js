const backend_url = "http://localhost:3000";

describe("AUTHENTICATION", () => {
    let token = "";
    const user = {
      name: `testUser${Math.floor(Math.random() * 100000)}`,
      phno: "1234567890",
      password: "12345678",
      email: `testUser${Math.floor(Math.random() * 100000)}@gmail.com`,
      city: "New York", 
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
    test("USER is able to sigin up  on /signup", async () => {
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
    test("USER is able to sigin up  on /signin  on email", async () => {
      const response = await fetch(backend_url + "/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: user.email,
          password: user.password,
        }),
      });
  
      const data = await response.json();
  
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("token");
      token = data.token;
    });
    test("USER is able to sigin up  on /signin    using phone", async () => {
      const response = await fetch(backend_url + "/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: user.phno,
          password: user.password,
        }),
      });
  
      const data = await response.json();
  
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("token");
      token = data.token;
    });
    test("USER is unable to signin with wrong password  on /signin", async () => {
      const response = await fetch(backend_url + "/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: user.email,
          password: "asfaasdgfg",
        }),
      });
      expect(response.status).toBe(401);
    });
  });