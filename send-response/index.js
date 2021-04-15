'use strict';

const AbortController = require('abort-controller');
const fetch = require('node-fetch');

module.exports = async function (context, myQueueItem) {
  if ( typeof myQueueItem === 'string' ) {
    context.log.error("Input queue item did not contain valid JSON");
    context.done();
  }

  if ( ! myQueueItem.input.args.meta && ! myQueueItem.input.args.meta.response_url ) {
    context.log.error("Input queue item did not contain a valid response url");
  }

  const responseUrl = myQueueItem.input.args.meta.response_url;
  const responseBody = myQueueItem;

  await deliverResponse(responseUrl, responseBody, myQueueItem);
};

/**
 * Attempts to deliver the response to the specified URL
 * @param {string} url The URL to deliver the response to
 * @param {object} body The body of the response
 * @return {object} Response and error, if present
 */
async function deliverResponse(url, body, myQueueItem) {
  const controller = new AbortController();
  const timeout = 5000;
  const timeoutHandler = setTimeout(
    () => {
      controller.abort();
    },
    timeout
  );

  let response = null;
  let error = null;

  await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal
  })
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        error = Error(`Could not send response to the provided response url--status code ${res.status} was returned.`);
      }
    })
    .then((resp_body) => {
      response = resp_body;
    },
    (err) => {
      if (err.name === 'AbortError') {
        error = Error('Could not deliver response to provided response url--request timed out.');
        if ( myQueueItem.hasOwnProperty('retry') ) {
          myQueueItem.retry += 1;
        } else {
          myQueueItem.retry = 1;
        }

        if ( myQueueItem.retry <= 5 ) {
          context.bindings.msg = myQueueItem;
        }
      } else {
        error = err;
      }
    })
    .finally(() => {
      clearTimeout(timeoutHandler);
    });

  return {
    html: response,
    error: error
  };
}
