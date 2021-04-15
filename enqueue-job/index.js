'use strict';

module.exports = async function (context, req) {
  // Set our response object
  let response = {
    status: 200,
    body: ''
  };

  let argError = false;

  if ( ! req.body || ! req.body.args ) {
    response.status = 400;
    response.body = 'The request body must include the an args array with valid arguments'
    argError = true;
  } else if ( ! req.body.args.hasOwnProperty('html') || ! req.body.args.hasOwnProperty('url') ) {
    response.status = 400;
    response.body = 'The args must include either the page "html" or a "url" to retrieve the html from'
    argError = true;
  } else if ( ! req.body.args.dimensions ) {
    response.status = 400;
    response.body = 'The args must include an array of "dimensions" which defines the width and height of each dimension'
    argError = true;
  }

  if ( argError ) {
    context.res = response;
    context.done();
  }

  context.bindings.msg = req.body;
  context.res = {
    body: "Successfully enqueued the request"
  }
}
