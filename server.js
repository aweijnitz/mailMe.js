// Note to try from the command line using curl in the tests folder
// curl -i -X POST -d @test-mail.json  --header "Content-Type:application/json" localhost:9090/email
// where you put your parameters that will be posted in the file params.json
//

var config = require('./config_prod.json');
var restify = require('restify');
var reqHandlers = require('./lib/handlers.js');

if(!config) {
    console.error('Could not find config.json. Make sure it is in the same directory as this file (server.js).');
    process.exit(1);
}

var server = restify.createServer({
    name: 'MyApp',
    version: '0.0.1'
});

// Throttle down the server to make spamming attempts useless
server.use(restify.throttle({
    burst: parseInt(config.throttle.burst),
    rate: parseInt(config.throttle.rate),
    ip: true
}));

server.use(restify.bodyParser());

// Add handler for mail submissions
server.post(config.apiEndpoint, reqHandlers.sendMail);

console.log('Mail endpoint listening on port ' + config.port + ' at ' + config.apiEndpoint);
server.listen(config.port);
