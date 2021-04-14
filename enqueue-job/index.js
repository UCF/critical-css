'use strict';

module.exports = async function (context, req) {
  if (req.body && req.body.args && req.body.args.html && req.body.args.dimensions) {
    context.bindings.msg = req.body;
    context.res = {
      body: "Success"
    }
  } else {
    context.res = {
      status: 400,
      body: "You must provide the html and dimensions arguments in the args field."
    }
  }
}
