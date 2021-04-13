'use strict';

const criticalHelper = require('../critical-css-utils');

const responseHeaders = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Content-type': 'application/json'
};


module.exports = function(context, req) {
  const args = req.body.args || {};
  try {
    criticalHelper(
      args,
      (err, criticalResponse) => {
        if (err) {
          returnError(context, req, err);
        } else {
          const { css } = criticalResponse;
          returnSuccess(context, req, css);
        }
      });
  } catch(e) {
    returnError(context, req, e);
  }
};


/**
 * Helper function that returns a successful context
 *
 * @param {object} context The request context passed to the function handler
 * @param {object} req Request params passed to the function handler
 * @param {*} result The successful result to return
 */
function returnSuccess(context, req, result) {
  let response = {
    status: 200,
    headers: responseHeaders,
    body: {
      result: result,
      input: req
    }
  };

  context.res = response;
  context.done();
}


/**
 * Helper function that returns an error context
 *
 * @param {object} context The request context passed to the function handler
 * @param {object} req Request params passed to the function handler
 * @param {object} err The Error that should be returned
 */
function returnError(context, req, err) {
  context.log.error(err);

  let response = {
    status: 500,
    headers: responseHeaders,
    body: {
      error: err.message,
      input: req
    }
  };

  context.res = response;
  context.done();
}
