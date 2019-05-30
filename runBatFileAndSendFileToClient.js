//Run batch file and send file to client for download.
const path = require('path');
var http = require('http');
var fs = require('fs');
var child_process = require('child_process');

const batchFilePath = "test.bat";

const server = http.createServer(function (req, res) {
    console.log(': ' + req.url);
    switch (req.url) {
        case '/':
            fs.readFile(__dirname + '/myPage.html',
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error loading myPage.html');
                    }
                    res.writeHead(200);
                    res.end(data);
                });
            break;
        case '/getFile':
            //run bat file: 
            //https://stackoverflow.com/a/36601805/51358           
            child_process.exec(batchFilePath, function (error, stdout, stderr) {
                console.log(stdout);
                if (error) {
                    const msg = 'Error executing ' + batchFilePath + ".Error: " + error;
                    console.log(msg);
                    res.writeHead(500);
                    return res.end(msg);
                }

                //send file to client for download: 
                //https://stackoverflow.com/questions/21578208/node-js-send-file-to-client
                const fileName = 'fileToDownload.exe';
                var filePath = path.join(__dirname, fileName);
                var stat = fs.statSync(filePath);
                var file = fs.readFileSync(filePath, 'binary');

                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.write(file, 'binary');

                console.log(fileName + ' sent to client for download.');

                res.end();
            });
            break;
    }
});

server.listen(3000, function () {
    console.log('listening on *:3000');
});
