'use strict';

var extend = require('extend');
var swig = require('swig');
var swigExtras = require('swig-extras');
var themeleon = require('themeleon')();
var sassdocExtras = require('sassdoc-extras');

swigExtras.useFilter(swig, 'split');
swigExtras.useFilter(swig, 'trim');
swigExtras.useFilter(swig, 'groupby');

swig.setFilter('push', function (arr, val) {
  return arr.push(val);
});

themeleon.use('consolidate');

module.exports = themeleon(__dirname, function (t) {
  var def = require('./default.json');

  t.ctx.groups = extend(def.groups, t.ctx.groups);
  t.ctx = extend({}, def, t.ctx);

  if (!t.ctx.display) {
    t.ctx.display = {};
  }

  t.ctx.display.annotations = {
    'function': ['description', 'parameter', 'return', 'example', 'throw', 'require', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'mixin': ['description', 'parameter', 'output', 'example', 'throw', 'require', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'placeholder': ['description', 'example', 'throw', 'require', 'usedby', 'since', 'see', 'todo', 'link', 'author'],
    'variable': ['description', 'type', 'property', 'require', 'example', 'usedby', 'since', 'see', 'todo', 'link', 'author']
  };

  sassdocExtras.markdown(t.ctx);
  sassdocExtras.display(t.ctx);
  sassdocExtras.groupName(t.ctx);
  sassdocExtras.shortcutIcon(t.ctx);

  t.ctx.data.byGroupAndType = sassdocExtras.byGroupAndType(t.ctx.data);

  var assetsPromise = t.copy('assets');

  if (t.ctx.shortcutIcon && t.ctx.shortcutIcon.type === 'internal') {
    assetsPromise.then(function () {
      return t.copy(t.ctx.shortcutIcon.path, t.ctx.shortcutIcon.url);
    });

    t.ctx.shortcutIcon.url = 'assets/img/' + t.ctx.shortcutIcon.url;
  }

  t.swig('views/documentation/index.html.swig', 'index.html');
});
