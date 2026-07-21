const allowedDomains = [
    "mail.jiit.ac.in"
];

const adminEmails = [
    "shallykaushik00@gmail.com",
    "devansh.tripathi2004@gmail.com"
];

const isCollegeEmail = (email) => {
    if (adminEmails.includes(email.toLowerCase())) {
        return true;
    }

    const domain = email.split("@")[1];

    return allowedDomains.includes(domain);

};

export default isCollegeEmail;