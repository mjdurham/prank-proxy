var http = require('http');
var connect = require('connect');
var url = require('url');
var PassThrough = require('stream').PassThrough;

var app = connect();

// this logs the host name of every request
app.use(function(req, res, next) {
	console.log(req.headers.host);
	next();
});

// load cat attack
var cats = require('./attacks/cats.js');
app.use(cats);

// build a pipeline of pipes for the attacks the change the response
app.use(function(req, res, next) {
	req.keystone = 0;
	req['keystone' + req.keystone] = new PassThrough();

	var srvUrl = url.parse(req.url);

	var options = {
		hostname: srvUrl.hostname,
		method: req.method,
		path: srvUrl.pathname,
		//don't forward the headers because of gzip
		//headers: req.headers
	};

	proxy_req = http.request(options, function (proxy_res) {
		// save the proxy_res headers before we pipe it so we can referece later
		req.type = proxy_res.headers['content-type'];

		res.writeHead(proxy_res.statusCode, proxy_res.headers);
		proxy_res.pipe(req['keystone' + req.keystone]);
		next();
	});

	// end the http request and respone to client in the callback
	req.pipe(proxy_req);

});

// Load the middleware attacks here that will change the responses
// to the clients. Theses attacks will use the request pipeline.

// this attack will flip all paragraphs
var inject = require('./attacks/flip.js');
app.use(inject);


// send the response after all of the attacks have finished
app.use(function(req, res) {
	req['keystone' + req.keystone].pipe(res);
});

http.createServer(app).listen(8080, function() {
	console.log('Listening on port 8080...');
});
