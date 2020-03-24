var nodemailer = require('nodemailer');

// Create the transporter with the required configuration for Gmail
// change the user and pass !
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    // use SSL
    auth: {
        user: 'user.900gpt@gmail.com',
        pass: process.env.MAILPASSWORD
    }
});

module.exports = transporter