'use strict';

const cheerio = require('cheerio');
const critical = require('critical');

/**
 * Helper function that performs critical CSS generation
 *
 * @param {*} params The arguments to pass to Critical
 * @param {function} cb The callback function
 */
module.exports = function(params, cb) {
  const args = params || {};
  const dimensions = args.dimensions || [];

  if (! args.hasOwnProperty('html')) {
    throw new Error('Could not generate critical CSS--no HTML provided.');
  }

  const criticalArgs = {
    inline: false,
    extract: false,
    minify: true,
    dimensions: dimensions,
    ignore: {
      atrule: ['@font-face'] // never include font-face declarations in our critical CSS
    },
    penthouse: {
      timeout: 60000 // milliseconds/1 minute
    }
  };

  criticalArgs.html = prepareHTML(args.html, args);

  critical.generate(criticalArgs, cb);
}


/**
 * Prepares HTML to be passed to Critical.
 *
 * @param {string} html HTML string
 * @param {object} args Arguments passed in to the request
 * @returns {string} Processed HTML
 */
 function prepareHTML(html, args) {
  // Load document into Cheerio for easier DOM processing/traversal
  const $ = cheerio.load(html);

  // Strip elements by CSS selector in source.exclude
  // so that Critical is forced to ignore them
  if (args.hasOwnProperty('exclude')) {
    args.exclude.forEach((ignoreRule) => {
      const $ignoreElem = $(ignoreRule);
      if ($ignoreElem.length) {
        $ignoreElem.remove();
      }
    });
  }

  // Remove preload and noscript tags in the head
  const $preload = $('head link[rel="preload"]');
  if ($preload.length) {
    $preload.remove();
  }
  const $noscript = $('head noscript');
  if ($noscript.length) {
    $noscript.remove();
  }

  // Revert any async loading stylesheets to non-async so
  // that Critical can do its job.
  //
  // For the purpose of this script, just set the media attr
  // to `screen` for all async-loaded styles.
  const $headStyles = $('head link[rel="stylesheet"]');
  if ($headStyles.length) {
    $headStyles.each((i, elem) => {
      const onload = $(elem).attr('onload');
      if (onload) {
        $(elem).attr('media', 'screen');
        $(elem).attr('onload', null);
      }
    });
  }

  const preparedHTML = $.html();

  return preparedHTML;
}
