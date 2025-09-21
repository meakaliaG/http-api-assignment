// HELPER - decides response type
// checks the accept header for correct media type
const getType = (request) => {
  const accept = request.headers.accept || '';
  if (accept.includes('application/xml')) {
    return 'xml';
  }
  // default case
  return 'json';
};

// HELPER - builds message response
const buildMessage = (state, message, type, isError = false) => {
  if (type === 'json') {
    const body = isError ? { message, id: state } : { message };
    return JSON.stringify(body);
  }
  if (isError) {
    return `<response><message>${message}</message><id>${state}</id></response>`;
  }
  return `<response><message>${message}</message></response>`;
};

// HELPER - general responder
const respond = (request, response, statusCode, statusName, message, isError = false) => {
  const type = getType(request);
  const body = buildMessage(statusName, message, type, isError);
  response.writeHead(statusCode, {
    'Content-Type': type === 'json' ? 'application/json' : 'application/xml',
  });
  response.write(body);
  response.end();
};

// status endpoint handlers
const success = (request, response, _query) => {
  respond(request, response, 200, 'success', 'CONGRA(5-10kHz)!!! This is a successful response.');
};
const badRequest = (request, response, query) => {
  if (query.valid === 'true') {
    return respond(request, response, 200, 'success', 'This request has the required parameters.');
  }
  return respond(request, response, 400, 'badRequest', 'Missing valid query parameter set to true', true);
};
const unauthorized = (request, response, query) => {
  if (query.lloggedIn === 'yes') {
    return respond(request, response, 200, 'success', 'You are authorized.');
  }
  return respond(request, response, 401, 'unauthorized', '*INTRUDER ALERT*You are not authorized!!*INTRUDER ALERT* \nMissing loggedIn query set to yes', true);
};
const forbidden = (request, response, _query) => {
  respond(request, response, 403, 'forbidden', 'You are forbidden!!', true);
};
const internal = (request, response, _query) => {
  respond(request, response, 500, 'internal', 'Internal Server Error. Something went wronf.', true);
};
const notImplemented = (request, response, _query) => {
  respond(request, response, 501, 'notImplemented', 'This functionality has not been implemented yet.', true);
};
const notFound = (request, response, _query) => {
  respond(request, response, 404, 'notFound', 'Does not exist the page you are looking for. (Cannot be found)', true);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
