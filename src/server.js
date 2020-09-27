const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  if (parsedUrl.pathname === '/addBoard') {
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addBoard(request, response, bodyParams);
    });
  } else if (parsedUrl.pathname === '/updateBoard') {
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.updateBoard(request, response, bodyParams);
    });
  }
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getBoard': jsonHandler.getBoard,
    '/getBoardList': jsonHandler.getBoardList,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getBoard': jsonHandler.getBoardMeta,
    '/getBoardList': jsonHandler.getBoardListMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
