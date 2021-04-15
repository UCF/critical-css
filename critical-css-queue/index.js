'use strict';

const criticalHelper = require('../critical-css-utils');

module.exports = function (context, myQueueItem) {
  const args = myQueueItem.args;

  try {
    criticalHelper(
      args,
      (err, criticalResponse) => {
        if (err) {
          returnError(context, myQueueItem, err);
        } else {
          const { css } = criticalResponse;
          returnSuccess(context, req, css);
        }
      });
  } catch (e) {
    returnError(context, myQueueItem, e);
  }
};

/**
 * Helper function that returns a successful context
 *
 * @param {object} context The request context passed to the function handler
 * @param {object} myQueueItem Queue item passed into the handler
 * @param {*} result The successful result to return
 */
function returnSuccess(context, myQueueItem, result) {
  let response = {
    result: result,
    input: myQueueItem
  };

  context.bindings.msg = response;
  context.done();
}

/**
 * Helper function that returns a successful context
 *
 * @param {object} context The request context passed to the function handler
 * @param {object} myQueueItem Queue item passed into the handler
 * @param {*} result The successful result to return
 */
function returnError(context, myQueueItem, err) {
  context.log.error(err);

  let response = {
    error: err.message,
    input: myQueueItem
  };

  context.bindings.msg = response;
  context.done();
}
