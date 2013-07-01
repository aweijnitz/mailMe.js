# mailMe.js
A Node.js REST webservice to accept requests and send emails. Intended to be used to handle emailing from a Contact form on a webpage via an AJAX call. Includes example client (html page with contact form).

## Installing mailMe.js
- Clone this repository to your server `git clone <URL>`
- Install dependencies `npm install`
- To run the tests, install mocha. `sudo npm install -g mocha`
- Optional: Run test to verify basic operation, run the tests `npm test`


## Setting up and using
### On the server
On the server, you need to configure the service. See file `config.json`.
You also want to map the api endpoint into your HTTP server, serving the rest of the site. That is not covered here.

#### Configuration
Key things to note that aren't obvious.

* **devMode**, will bypass actual email sending and instead log to the logfile.
* **throttle**, are in requests/second and throttles access to the web service per IP
* **logRotationPeriod**, regulates how often to rotate logs. See [Bunyan docs](https://github.com/trentm/node-bunyan).
* **mail* **, all direct input to nodemailer. See the [Nodemailer Site](http://www.nodemailer.com/) for details on valid options for mailTransportServices for example.


Default config file

	{
    	"port": "9090",
    	"apiEndpoint": "/email",
    	"mailTransportService": "Gmail",
    	"mailServerCredentials": 
    		{"user": "<USER NAME>",
    		 "pass": "<PASS>"},
    	"mailReceivers": [
    		"some.guy@mail.net",
    		"another.receiver@another.org"],
    	"throttle": { "rate": "2", "burst": "5" },
    	"logFile": { 
    		"name": "./logs/mailMe.log",
    		"logRotationPeriod": "3m"},
    	"devMode": false
	}


#### Verifying that the service works
You can use __curl__ to verify that the service works.
From the command line, on the same server

	curl -i -X POST -d @test-mail.json  --header "Content-Type:application/json" localhost:9090/email 

You can find a complete test file, `test-mail.json` in the tests folder.

### In the client (the contact form)
Usage:

#### Checking service available
To check that the service is available, make a `HTTP GET` request, which should return `200, "Mailer ready"`

#### Submitting an email from a HTML contact form
To sumit an email, make a `HTTP POST` to the api endpoint (default /email). It should return `202, "Thank you! Mail sent."`.

The server currently expects these values in the POST call

* **from** - Who is it from?
* **subject** - The subject line
* **msg** - The message body

You need to __mount the API endpoint on the same domain as the form page__  so that you can make an AJAX calls to it.

There is a full example form page in the test folder (`testform.html`).


## Technical overview
The whole things is basically some small code to glue together the following:

* REST engine: [Restify](http://mcavage.github.io/node-restify/)
* Mail engine: [Nodemailer](http://www.nodemailer.com/)
* Loggger: [Bunyan](https://github.com/trentm/node-bunyan)


## Running the tests
Tests are written in Mocha, using Should.js

One shot: `npm test`

Watch mode: `mocha -w -R dot`

## License
__MIT__
