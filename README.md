#Prank Proxy
prank-proxy is a proxy that manipulates the requests and responses of http traffic.

	# Fetch this project
	git clone https://github.com/mjdurham/prank-proxy.git

	# Enter the repository
	cd prank-proxy

	# Install the connect dependency locally
	npm install connect

	# Compile and run the application
	node app.js


##Design
All of the attacks are connect modules that can be loaded in the main app.js file.  Every time an http request is created an array of pass through streams is created so every attack module can pipe into the next attack.  This modular approach allows new attacks to be easily added to the program.  An example of this is shown in the flip.js module.
