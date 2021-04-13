'use strict';

const criticalHelper = require('../critical-css-utils');

const responseBase = {
  status: 200,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Content-type': 'application/json'
  },
  body: {}
}


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
  let response = responseBase;
  response.body.result = result;
  response.body.input  = req;

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
  context.log(err);

  let response = responseBase;
  response.status     = 500;
  response.body.error = err.message;
  response.body.input = req;

  context.res = response;
  context.done();
}
