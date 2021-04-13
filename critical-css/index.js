'use strict';

const criticalHelper = require('../critical-css-utils');

module.exports = function(context, req) {
  let response = {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Content-type': 'application/json'
    },
    body: {},
  };

  const args = req.body.args || {};
  try {
    criticalHelper(
      args,
      (err, { css }) => {
        if (err) {
          throw err;
        } else {
          response.body.result = css;
          response.body.input = req;
          context.res = response;
        }

        context.done();
    });
  } catch(e) {
    context.log(e);
    response.status = 500;
    response.body.error = e.message;
    response.body.input = req;
    context.res = response;
    context.done();
  }
};
