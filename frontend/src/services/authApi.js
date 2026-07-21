/**
 * Flames Authentication API Stubs
 * All API functions include // TODO: connect to backend comments.
 */

export const DEMO_CREDENTIALS = {
  identifier: 'alexrivers',
  collegeEmail: 'alex.rivers@jiit.ac.in',
  password: 'Password123',
  user: {
    id: 'usr_demo_1',
    name: 'Alex Rivers',
    username: 'alexrivers',
    email: 'alex.rivers@jiit.ac.in',
    major: 'Computer Science',
    graduationYear: '2025',
    joinedDate: 'July 2026',
    bio: 'UI/UX Designer\nHackathon Enthusiast\nBuilding Flames 🔥',
    gender: 'Male',
    hasCompletedSetup: true,
  },
};

// TODO: connect to backend - POST /api/v1/auth/login
export async function loginApi(identifier, password) {
  console.log('[API Stub] Login attempt with:', { identifier, password });
  // TODO: connect to backend - POST /api/v1/auth/login { identifier, password }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isEmail = identifier.includes('@');
      if (
        (isEmail && identifier.toLowerCase() === DEMO_CREDENTIALS.collegeEmail.toLowerCase()) ||
        (!isEmail && identifier.toLowerCase() === DEMO_CREDENTIALS.identifier.toLowerCase())
      ) {
        if (password === DEMO_CREDENTIALS.password || password.length >= 6) {
          resolve({
            success: true,
            user: {
              ...DEMO_CREDENTIALS.user,
              email: isEmail ? identifier : DEMO_CREDENTIALS.collegeEmail,
              username: !isEmail ? identifier : DEMO_CREDENTIALS.identifier,
            },
            token: 'mock_jwt_token_12345',
          });
          return;
        }
      }
      // Demo fallback login for any valid input
      if (identifier.trim() && password.length >= 6) {
        resolve({
          success: true,
          user: {
            ...DEMO_CREDENTIALS.user,
            name: identifier.split('@')[0],
            username: identifier.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
            email: isEmail ? identifier : `${identifier}@campus.edu`,
          },
          token: 'mock_jwt_token_12345',
        });
      } else {
        reject(new Error('Invalid college email/username or password.'));
      }
    }, 600);
  });
}

// TODO: connect to backend - POST /api/v1/auth/signup
export async function signupApi(payload) {
  console.log('[API Stub] Sign Up payload:', payload);
  // TODO: connect to backend - POST /api/v1/auth/signup { fullName, username, collegeEmail, personalEmail, phoneNumber, password }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'OTP sent successfully to college email.',
        collegeEmail: payload.collegeEmail,
      });
    }, 600);
  });
}

// TODO: connect to backend - POST /api/v1/auth/verify-otp
export async function verifyOtpApi(collegeEmail, otp) {
  console.log('[API Stub] Verify OTP:', { collegeEmail, otp });
  // TODO: connect to backend - POST /api/v1/auth/verify-otp { collegeEmail, otp }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456' || otp.length === 6) {
        resolve({
          success: true,
          user: {
            id: `usr_${Date.now()}`,
            name: 'New Student',
            username: 'newstudent',
            email: collegeEmail,
            major: 'Computer Science',
            graduationYear: '2026',
            joinedDate: 'July 2026',
            hasCompletedSetup: false,
          },
          token: 'mock_jwt_token_67890',
        });
      } else {
        reject(new Error('Invalid OTP code. Please enter 123456 or a valid 6-digit code.'));
      }
    }, 500);
  });
}

// TODO: connect to backend - POST /api/v1/auth/resend-otp
export async function resendOtpApi(collegeEmail) {
  console.log('[API Stub] Resend OTP to:', collegeEmail);
  // TODO: connect to backend - POST /api/v1/auth/resend-otp { collegeEmail }
  return new Promise((resolve) => setTimeout(resolve, 400));
}
