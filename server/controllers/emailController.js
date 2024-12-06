const nodemailer = require('nodemailer');

/**
 * Sends an email using the Gmail service.
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The body/content of the email.
 */
const sendMail = async (email, subject, message) => {
    // Create a transporter object using Gmail's SMTP service
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "donotreplyfindme4@gmail.com",
            pass: "Findme@1234",
        },
        debug: true,
    });

    await transporter.sendMail({
        from: "donotreplyfindme4@gmail.com",
        to: email,
        subject,
        text: message,
    });
};

module.exports = { sendMail };