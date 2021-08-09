const fs = require('fs');
const path = require('path');

/**
 * Writes out an HTML content to the page and modify it if necessary
 * @param {object} htmlParts - contains reference to proper html files and data to print to the page 
 * @param {http.IncomingMessage} res - incoming message emmited by createServer and passed via router.renderingRoute
 */
function renderHtml(htmlParts, res){
    let data = '';
    for (const property in htmlParts){
        //It is object in one case, if both elements in body property stores some values (first value has a refrence to html, the second stores a data from lorem API)
        //If body property stores just one value, it is just a string
        //So it happens only once, when body stores also a data from lorem API
        if (typeof htmlParts[property] === 'object'){
            let chunk = '';
            chunk += fs.readFileSync(`${htmlParts[property][0]}`);
            chunk = chunk.replace('{{wygenerowano}}', htmlParts.body[1]);
            data += chunk;
        } else {
            data += fs.readFileSync(`${htmlParts[property]}`);
        }

   }
    res.end(data, 'utf-8');
}
/**
 * Writes to the page static non html files according to paths included in html files
 * @param {http.IncomingMessage} req - incoming message emmited by createServer, contains paths to the static files that are included in html
 * @param {http.IncomingMessage} res - incoming message emmited by createServer allow to write content
 */
function renderNonHtml(req, res) {
    //Adding dot to names in req.url to create a proper path
    let filePath = '.' + req.url;
    console.log('req.url', req.url);
    
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        const contentType = mimeTypes[path.extname(filePath)] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if(err.code == 'ENOENT') {
                    fs.readFile('./404.html', function(err, data) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(data, 'utf-8');
                    });
                }
                else {
                    res.writeHead(500);
                    res.end(`Sorry, check with the site admin for error: ${err.code}..\n`);
                }
            }
            else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data, 'utf-8');
            }
        });
}

module.exports.renderHtml = renderHtml;
module.exports.renderNonHtml = renderNonHtml;