'use strict';

var extend = require('extend');
var swig = new (require('swig').Swig)();
var swigExtras = require('swig-extras');
var themeleon = require('themeleon')();
var sassdocExtras = require('sassdoc-extras');
var chroma = require('chroma-js');
var swigFilters = require('swig/lib/filters');

swigExtras.useFilter(swig, 'split');
swigExtras.useFilter(swig, 'trim');
swigExtras.useFilter(swig, 'groupby');

function safe(fn) {
  fn.safe = true;
  return fn;
}

swig.setFilter('display_as_type', safe(function (input) {
  return input.split('|')
    .map(function (_) { return _.trim(); })
    .map(swigFilters.capitalize)
    .join('</code> or <code>')
}));

/**
 * Normalises a CSS color, then uses the YIQ algorithm to get the correct contrast.
 * @return {string} `#000` or `#fff` depending on which one is a better contrast.
 * @see {@link http://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area|this thread} for further information.
 */
swig.setFilter('yiq', function (color) {
  var hex = chroma(color).hex().substr(1);

  function getChannel(start) {
    return parseInt(hex.substr(start, 2), 16);
  };

  var red   = getChannel(0);
  var green = getChannel(2);
  var blue  = getChannel(4);
  var yiq   = ( (red * 299) + (green * 587) + (blue * 114) ) / 1000;

  return (yiq >= 128) ? '#000' : '#fff';
});

themeleon.use('swig', swig);

var theme = themeleon(__dirname, function (t) {
  var assetsPromise = t.copy('assets');

  if (t.ctx.shortcutIcon && t.ctx.shortcutIcon.type === 'internal') {
    assetsPromise.then(function () {
      return t.copy(t.ctx.shortcutIcon.path, t.ctx.shortcutIcon.url);
    });

    t.ctx.shortcutIcon.url = 'assets/img/' + t.ctx.shortcutIcon.url;
  }

  t.swig('views/documentation/index.html.swig', 'index.html');
});

module.exports = function (dest, ctx) {
  var def = require('./default.json');

  ctx.groups = extend(def.groups, ctx.groups);
  ctx.display = extend(def.display, ctx.display);
  ctx = extend({}, def, ctx);

  ctx.display.annotations = {
    'function': ['description', 'parameter', 'return', 'example', 'throw', 'require', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'mixin': ['description', 'parameter', 'content', 'output', 'example', 'throw', 'require', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'placeholder': ['description', 'example', 'throw', 'require', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'variable': ['description', 'type', 'property', 'require', 'example', 'usedby', 'since', 'see', 'todo', 'link', 'author']
  };

  sassdocExtras.markdown(ctx);
  sassdocExtras.display(ctx);
  sassdocExtras.groupName(ctx);
  sassdocExtras.shortcutIcon(ctx);

  ctx.data.byGroupAndType = sassdocExtras.byGroupAndType(ctx.data);

  return theme.call(this, dest, ctx);
};
