const backend_url = "http://localhost:3000/api";



describe("AUTHENTICATION",()=>{
  let token="";
  const user={
    "name": "testUser"+Math.random(),
    "phno": "1234567890",
    "password":"12345678",
    
    "email": "testUser"+Math.random()+"@gmail.com",
    "city": "{{randomCity}}",
    "linkdin": "{{randomUrl}}",
    "github": "https://github.com/shatwik7",
    "education": [
      {
        "college_name": "Harvard University",
        "major": "Computer Science",
        "starting": "09/2015",
        "ending": "06/2019",
        "gpa": 3.8
      }
    ]
  }
  test('USER is able to sigin up  on /signup',async ()=>{
    const response = await fetch(backend_url + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data).toHaveProperty("token");
    token=token;
  })
  test('USER is able to sigin up  on /signin',async ()=>{
    const response = await fetch(backend_url + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier:user.email,
        password:user.password
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("token");
    token=token;
  })
  
})