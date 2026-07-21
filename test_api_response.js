import ApiResponse from './backend/src/utils/ApiResponse.js';

const loginData = { user: { name: 'Test' }, token: 'abc' };

// Simulate auth.controller.js which calls: new ApiResponse(200, data, "Login successful")
const res = new ApiResponse(200, loginData, "Login successful");

console.log("JSON response sent by backend:", JSON.stringify(res, null, 2));
