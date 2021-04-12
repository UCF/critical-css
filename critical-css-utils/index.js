'use strict';

const cheerio = require('cheerio');
const critical = require('critical');

/**
 * Helper function that runs the critical generation
 * @param {*} args The arguments to pass to critical
 * @param {function} cb The callback function
 */
module.exports = function(args, cb) {
  const criticalArgs = {
    inline: false,
    extract: false,
    minify: false,
    dimensions: args.dimensions,
    ignore: {
      atrule: ['@font-face'] // never include font-face declarations in our critical CSS
    },
    penthouse: {
      timeout: 60000 // milliseconds/1 minute
    }
  };

  criticalArgs.html = sanitizeHTML(args.html, args);

  critical.generate(criticalArgs, cb);
}

/**
 * TODO
 *
 * @param {string} html HTML string
 * @param {object} args Arguments passed in to the request
 * @returns {string} Processed HTML
 */
 function sanitizeHTML(html, args) {
  // Load document into Cheerio for easier DOM processing/traversal
  const $ = cheerio.load(html);

  // Remove existing inline critical CSS
  // TODO this needs to be made a configurable option
  const $existingCriticalCSS = $('style#critical-css');
  if ($existingCriticalCSS.length) {
    $existingCriticalCSS.remove();
  }

  // Strip stylesheets whose hrefs are found in
  // source.ignoreStylesheets, because Critical
  // apparently can't do this on its own
  // TODO should probably update this to allow the entire CSS selector to be configurable per stylesheet
  if (args.ignoreStylesheets) {
    args.ignoreStylesheets.forEach((ignoreRule) => {
      const $ignoreStylesheets = $(`link[rel="stylesheet"][href^="${ignoreRule}"]`);
      if ($ignoreStylesheets.length) {
        $ignoreStylesheets.remove();
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
  // that critical can do its job.
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

  const sanitizedHTML = $.html();

  return sanitizedHTML;
}
