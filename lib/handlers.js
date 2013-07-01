var restify = require('restify');
var bunyan = require('bunyan');

// Some HTTP response codes
// See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
var ACCEPTED = 202;
var INTERNAL_ERROR = 500;


var createMailHandler = function (mailTransport, applicationConf) {
    var config = applicationConf;

    return function (req, res, next) {
        var logger = req.log;
        logger.info("Email send request received");

        if (reqParamsValid(req, logger)) {
            var err = null;

            if (!config.devMode) {
                mailTransport.send(req.params.from, config.mailReceivers, req.params.subject, req.params.msg,
                    function (error, response) {
                        if (error) {
                            logger.error({params: reg.params}, error);
                            err = error;
                            res.send(INTERNAL_ERROR, "Oups! Seems something is not right with the mailer. Couldn't send.");
                        } else {
                            logger.info({message: response.message}, "Message sent.");
                            res.send(ACCEPTED, "Thank you! Mail sent.");
                        }
                    });
                if (err)
                    return next(new restify.InternalServerError());
                else
                    return next();
            }
            else { // DEV MODE. ALWAYS OK
                logger.info({message: "DEV MODE"}, "FAKING message sent. DEV MODE");
                console.log("DEV MODE. Faked sending email.");
                res.send(ACCEPTED, "Thank you! Mail sent.");
            }
        }
        else
            return next(new restify.InvalidArgumentError("Invalid parameters."));
    };
};

var reqParamsValid = function (req, logger) {
    var isValid = true;

    // Make sure request has all expected params.
    if (!(req.params.from && req.params.subject && req.params.msg)) {
        logger.error({params: req.params}, "Invalid params!")
        isValid = false;
    }

    return isValid;
};

exports.createMailHandler = createMailHandler;
