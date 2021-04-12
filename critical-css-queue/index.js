module.exports = async function (context, myQueueItem) {
  const requestBody = req.body.Records[0].body;
  const args = requestBody.args;

  critical(args, (err, { css }) => {
    if (err) {
      context.error(err);
    } else {
      context.log(css)
    }

    context.done();
  });
};
