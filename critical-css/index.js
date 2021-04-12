'use strict';

const critical = require('../critical-css-utils');

module.exports = function(context, req) {
  let response = {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Content-type': 'application/json'
    },
    body: {
      result: null,
      input: req,
    },
  };

  const requestBody = req.body.Records[0].body;
  const args = requestBody.args;

  critical(args, (err, { css }) => {
    if (err) {
      context.error(err);
      response.status = 500;
      response.body.result = err;
      context.res = response;
    } else {
      response.body.result = css;
      context.res = response;
    }

    context.done();
  });
};
