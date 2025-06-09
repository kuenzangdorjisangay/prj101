const nodemailer = require('nodemailer');

exports.sendFeedback = (req, res) => {
    const { rating, feedback } = req.body;

    // Configure transporter - replace with your email details
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '12240050.gcit@rub.edu.bt',
        pass: 'bnut xuiu ulpk eflg',
    },
    tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
    },
});

    const mailOptions = {
        from: '12240050.gcit@rub.edu.bt',          // sender address
        to: '12240050.gcit@rub.edu.bt',        // admin email (receiver)
        subject: 'New Feedback Received',
        text: `Rating: ${rating}\nFeedback: ${feedback}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending mail:', error);
            return res.status(500).send('Error sending feedback.');
        }
        res.send('Thank you for your feedback!');
    });
};
