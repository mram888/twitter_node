# twitter_node
A NodeJS service to use the Twitter Streaming API making easy to connect to and consume the Twitter stream via the Streaming API.

### Clone the project
```
git clone https://github.com/mram888/twitter_node.git && cd twitter_node
```

### Install all the node modules and the bower components needed
```
npm install && cd public && bower install && cd ..
```

### Edit the configuration file (config.json) with the data of a Twitter app
```
{
	"TWITTER_CONSUMER_KEY": "",
	"TWITTER_CONSUMER_SECRET": "",
	"TWITTER_ACCESS_TOKEN": "",
	"TWITTER_ACCESS_TOKEN_SECRET": ""
}
```

### If the project is not localhost and it's in an external host, change the host variable in public/js/app.js:
```
var host = 'localhost:3000';
```

### Start the program
```
node app
```

### See the demo
http://52.29.38.159:3000
