import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
      collegeEmail: 'sarah.chen@jiit.ac.in', // Or whatever a test user is, wait maybe I shouldn't rely on existing users.
      password: 'password123' 
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
