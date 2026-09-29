const axios = require('axios');

async function run() {
  try {
    const login = await axios.post("http://localhost:8000/api/v1/auth/login", {
      email: "testuser@example.com",
      password: "password123"
    });
    console.log("LOGIN HEADERS:", login.headers);
  } catch (e) {
    console.log("LOGIN ERROR:", e.response?.data || e.message);
  }
}

run();
