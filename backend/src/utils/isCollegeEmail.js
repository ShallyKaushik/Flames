const allowedDomains = [
    "mail.jiit.ac.in"
];

const isCollegeEmail = (email) => {

    const domain = email.split("@")[1];

    return allowedDomains.includes(domain);

};

export default isCollegeEmail;