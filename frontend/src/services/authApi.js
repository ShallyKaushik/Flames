import api from './api';

export async function loginApi(identifier, password) {
  try {
    const response = await api.post('/auth/login', { 
      collegeEmail: identifier, 
      password 
    });
    
    // The backend loginUser service returns { user, accessToken, refreshToken }
    // However, the controller might just wrap it in data
    const data = response.data.message || response.data.data;
    
    return {
      success: true,
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    if (error.response?.data?.errors?.length) {
      throw new Error(error.response.data.errors[0].msg);
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please check your credentials.');
  }
}

export async function signupApi(payload) {
  try {
    const response = await api.post('/auth/register', payload);
    return {
      success: true,
      message: response.data.message || 'OTP sent successfully to college email.',
      collegeEmail: payload.collegeEmail,
    };
  } catch (error) {
    if (error.response?.data?.errors?.length) {
      throw new Error(error.response.data.errors[0].msg);
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Sign Up failed. Please check your details.');
  }
}

export async function verifyOtpApi(collegeEmail, otp) {
  try {
    const response = await api.post('/auth/verify-otp', { collegeEmail, otp });
    const data = response.data.message || response.data.data;

    return {
      success: true,
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    if (error.response?.data?.errors?.length) {
      throw new Error(error.response.data.errors[0].msg);
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Invalid OTP code. Please try again.');
  }
}

export async function resendOtpApi(collegeEmail) {
  try {
    await api.post('/auth/resend-otp', { collegeEmail });
    return { success: true };
  } catch (error) {
    throw new Error('Failed to resend OTP.');
  }
}
