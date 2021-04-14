'use strict';

const criticalHelper = require('../critical-css-utils');

module.exports = function (context, myQueueItem) {
  const args = myQueueItem.args;

  try {
    criticalHelper(
      args,
      (err, criticalResponse) => {
        if (err) {
          context.log.error(err);
        } else {
          const { css } = criticalResponse;
          context.log.info(css);
        }

        context.done();
      }
    );
  } catch (e) {
    context.log.error(e);
  }
};
