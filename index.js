const http = require('http');
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');

class MyClassificationPipeline {
    static task = 'text-classification';
    static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
        // Dynamically import the Transformers.js library
        let { pipeline, env } = await import('@xenova/transformers');

        // NOTE: Uncomment this to change the cache directory
        // env.cacheDir = './.cache';

        this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }
}


// Define the HTTP server
const server = http.createServer();
const port = process.env.PORT || 3000;

// Listen for requests made to the server
server.on('request', async (req, res) => {
  // Parse the request URL
  const parsedUrl = url.parse(req.url);

  // Extract the query parameters
  const { text } = querystring.parse(parsedUrl.query);

  // Set the response headers
  // res.setHeader('Content-Type', 'application/json');
  // res.setHeader('Access-Control-Allow-Origin', '*');

  let response;

  if (parsedUrl.pathname == "/") {
    fs.readFile('index.html', function (err, html) {
        if (err) throw err;    
        res.write(html);
        res.end()
    });
  }

  if (parsedUrl.pathname === '/classify' && text) {
    const classifier = await MyClassificationPipeline.getInstance();
    response = await classifier(text);
    res.statusCode = 200;
    res.end(JSON.stringify(response));
  }

  // Send the JSON response
  // res.end(JSON.stringify(response));
});

server.listen(port, () => {
  console.log(`Server running at Port:${port}`);
});
