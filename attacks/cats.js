var fs = require('fs');

module.exports = function(req, res, next) {

	// if the browser requests an image, send a cat.
	// otherwise continue to the next function
	if (req.headers.accept.search("image") != -1) {
		console.log('-returning picture of cat');
		var file = fs.createReadStream("./attacks/cat.jpg");
		res.writeHead(200, {'Content-Type': 'image/jpeg' });
		file.pipe(res);

	} else {
		next();
	}
};
