const axios = require('axios');

async function run() {
  try {
    const signup = await axios.post("http://localhost:8000/api/v1/auth/register", {
      full_name: "Test User",
      email: "testuser@example.com",
      password: "password123"
    });
    console.log("SIGNUP SUCCESS:", signup.data);
  } catch (e) {
    console.log("SIGNUP ERROR:", e.response?.data || e.message);
  }
  
  try {
    const login = await axios.post("http://localhost:8000/api/v1/auth/login", {
      email: "testuser@example.com",
      password: "password123"
    });
    console.log("LOGIN SUCCESS:", login.data);
  } catch (e) {
    console.log("LOGIN ERROR:", e.response?.data || e.message);
  }
}

run();
