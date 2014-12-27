var util = require('util');
var Transform = require('stream').Transform;
var PassThrough = require('stream').PassThrough;
util.inherits(Injector, Transform);

module.exports = function(req, res, next) {

	if (req.type !== undefined && req.type.search("text/html") != -1) {
		// increase the pipeline count
		req.keystone++;
		// create a new pass through stream for the next attack
		req['keystone' + req.keystone] = new PassThrough();

		// apply the attack
		var inject_pipe = new Injector();
		req['keystone' + (req.keystone - 1)].pipe(inject_pipe).pipe(req['keystone' + req.keystone]);
	}

	next();

};

function Injector (options) {
	// allow use without new
	if (!(this instanceof Injector)) {
		return new Injector(options);
	}

	// init Transform
	Transform.call(this, options);
}

Injector.prototype._transform = function (chunk, encoding, done) {
	//pipe everything before the ending body tag
	var data = chunk.toString().split("</body>", 1);
	this.push(data[0].toString());
	done();
};

Injector.prototype._flush = function (done) {
	console.log('-flipping text on pipe');
	this.push('<style type="text/css">p {-moz-transform: scaleY(-1);-webkit-transform: scaleY(-1);transform: scaleY(-1);filter: flipv;}</style></body></html>');
	done();
};
