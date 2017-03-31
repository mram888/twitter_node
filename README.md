# twitter_node
A NodeJS service to use the Twitter Streaming API making easy to connect to and consume the Twitter stream via the Streaming API.

### Install all the node modules needed
npm install

### Edit the configuration file (config.json) with the data of a Twitter app
{
	"TWITTER_CONSUMER_KEY": "",
	"TWITTER_CONSUMER_SECRET": "",
	"TWITTER_ACCESS_TOKEN": "",
	"TWITTER_ACCESS_TOKEN_SECRET": ""
}

### Start the program
node app

### Call the URI with the Twitter term to look for with the Streaming API
http://localhost:3000/api/tweets/{your_term}

For example:
http://localhost:3000/api/tweets/trump
http://localhost:3000/api/tweets/hello

### Next steps
Add the frontend to consume the service
