const boards = {};
const boardSize = 5;

const createNewBoard = () => {
  const newBoard = new Array(boardSize);
  for (let i = 0; i < boardSize; i++) {
    newBoard[i] = new Array(boardSize);
    for (let j = 0; j < boardSize; j++) {
      newBoard[i][j] = '#ffffff';
    }
  }
};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const addBoard = (request, response, body) => {
  const responseJSON = {
    message: 'A unique name for the board is required',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (boards[body.name]) {
    responseJSON.id = 'preexistingBoard';
    return respondJSON(request, response, 400, responseJSON);
  }

  boards[body.name] = {
    name: body.name,
    board: createNewBoard(),
  };

  responseJSON.message = 'Created Successfully!';
  return respondJSON(request, response, 201, responseJSON);
};

const getBoardList = (request, response) => {
  const responseJSON = {
    names: Object.keys(boards),
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getBoardListMeta = (request, response) => { respondJSONMeta(request, response, 200); };

const getBoard = (request, response, params) => {
  const responseJSON = {
    message: 'The name of the board is required to retrieve',
  };

  if (!params.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (!boards[params.name]) {
    responseJSON.message = 'A board with that name does not exist';
    responseJSON.id = 'incorrectName';
    return respondJSON(request, response, 400, responseJSON);
  }

  responseJSON.board = boards[params.name];

  responseJSON.message = 'Board retrieved!';
  return respondJSON(request, response, 200, responseJSON);
};

const getBoardMeta = (request, response) => { respondJSONMeta(request, response, 200); };

const updateBoard = (request, response, body) => {
  const responseJSON = {
    message: 'Name and board are both required',
  };

  if (!body.name || !body.board) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  boards[body.name].board = body.board;

  responseJSON.message = 'Updated successfully';
  return respondJSON(request, response, 204, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  addBoard,
  getBoard,
  getBoardMeta,
  getBoardList,
  getBoardListMeta,
  notFound,
  notFoundMeta,
  updateBoard,
};
