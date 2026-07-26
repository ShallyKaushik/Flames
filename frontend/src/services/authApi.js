import api from './api';

export async function googleLoginApi(idToken) {
  try {
    const response = await api.post('/auth/google', { idToken });
    // The backend googleLogin service returns { user, accessToken, refreshToken }
    // API response wrapper might put it in data or message
    const data = response.data.data || response.data;
    
    if (data.isNewUser) {
      return {
        success: true,
        isNewUser: true,
        googleData: data.googleData,
        idToken,
      };
    }

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
    throw new Error('Google Login failed.');
  }
}

export async function completeProfileApi(payload) {
  try {
    const response = await api.post('/auth/complete-profile', payload);
    const data = response.data.data || response.data;
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
    throw new Error('Profile setup failed.');
  }
}

export async function checkUsernameApi(username) {
  try {
    const response = await api.get('/auth/check-username', { params: { username } });
    const data = response.data.data || response.data;
    return data.isAvailable;
  } catch (error) {
    return false;
  }
}
