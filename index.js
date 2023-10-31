const http = require('http');
const url = require('url');
const fs = require('fs');
const port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});

    let q = url.parse(req.url, true);
    if(q.pathname == "/") {
        fs.readFile('index.html', function (err, html) {
            if (err) throw err;    
            res.write(html);
            res.end()
        });
    }
}).listen(port);

console.log("Application listening on port " + port);