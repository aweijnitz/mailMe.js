var nodemailer = require("nodemailer");

var createTransport = function(user, pass, service) {

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: service,
        auth: {
            user: user,
            pass: pass
        }
    });

    return {
        send: function(sender, receivers, subject, msgBody, callback) {
            smtpTransport.sendMail({
                from: sender, // sender address
                to: receivers, // comma separated list of receivers
                subject: subject, // Subject line
                text: msgBody // plaintext body
            }, callback);
        }
    };
};


exports.createTransport = createTransport;