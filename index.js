'use strict';

var extend = require('extend');
var swig = new (require('swig').Swig)();
var swigExtras = require('swig-extras');
var themeleon = require('themeleon')();
var sassdocExtras = require('sassdoc-extras');

swigExtras.useFilter(swig, 'split');
swigExtras.useFilter(swig, 'trim');
swigExtras.useFilter(swig, 'groupby');

swig.setFilter('push', function (arr, val) {
  return arr.push(val);
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
  if (!('view' in ctx)) {
    ctx.view = {};
  }

  var defaultView = require('./view.json');
  ctx.view = extend({}, defaultView, ctx.view);
  ctx.view.groups = extend(defaultView.groups, ctx.view.groups);
  ctx.view.display = extend(defaultView.display, ctx.view.display);

  ctx.view.display.annotations = {
    'function': ['description', 'parameters', 'returns', 'example', 'throws', 'requires', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'mixin': ['description', 'parameters', 'output', 'example', 'throws', 'requires', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'placeholder': ['description', 'example', 'throws', 'requires', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'variable': ['description', 'type', 'prop', 'requires', 'example', 'usedby', 'since', 'see', 'todo', 'link', 'author']
  };

  sassdocExtras.markdown(ctx);
  sassdocExtras.display(ctx);
  sassdocExtras.groupName(ctx);
  sassdocExtras.shortcutIcon(ctx);

  ctx.data.byGroupAndType = sassdocExtras.byGroupAndType(ctx.data);

  return theme.apply(this, arguments);
};
