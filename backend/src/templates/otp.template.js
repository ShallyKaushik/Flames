const otpTemplate = (otp) => {

    return `
        <div style="font-family:Arial;padding:20px">

            <h2>Flames Email Verification</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>

        </div>
    `;

};

export default otpTemplate;