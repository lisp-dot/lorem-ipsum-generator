const render = require('./render.js');
const https = require('https');
const querystring = require('query-string');

/**
 * Writes static files to the page and proper body html file depends on url in req object
 * @param {object} req - Incoming message containing proper URL
 * @param {object} res - Incoming message allows us to write the content to the page
 */
function renderingRoute(req, res) {
    //In htmlParts object body property is an array because it has to contain reference to proper html body file
    //And if it's a lorem_body it also has to contain a proper data to write to the page
    let htmlParts = {
        header: './header.html',
        body: ['', ''],
        footer: './footer.html'
    }

    if (req.url === '/') {
        htmlParts.body = './index_body.html';
        render.renderHtml(htmlParts, res);
    } else if (req.url === '/lorem') {
        let query = '';
        //Here we get to query in HTTP request body
        req.on('data', chunk => query += chunk);
        req.on('end', () => {
            query = querystring.parse(query);
            console.log(query);
            let specifiedURL = `https://loripsum.net/api/${parseInt(query.paragraphs)}/`
            for (let keys in query) {
                specifiedURL += `/${query[keys]}`;
            }
            console.log(specifiedURL);
            htmlParts.body[0] = `.${req.url}_body.html`;
            https.get(specifiedURL, (response) => {
                let data = '';
                response.on('data', (d) => data += d);
                response.on('end', () => {
                    htmlParts.body[1] = data;
                    render.renderHtml(htmlParts, res);
                });
            });
        });
    } else {
        render.renderNonHtml(req, res);
    }
}

module.exports.renderingRoute = renderingRoute;