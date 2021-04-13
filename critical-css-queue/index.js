'use strict';

const criticalHelper = require('../critical-css-utils');

module.exports = function (context, myQueueItem) {
  const args = myQueueItem.args;

  try {
    criticalHelper(
      args,
      (err, {css}) => {
        if (err) {
          context.error(err);
        } else {
          context.log(css);
        }

        context.done();
      }
    );
  } catch (e) {
    context.error(e);
  }
};
