import chroma from 'chroma-js';
import def from '../default';
import denodeify from 'promise-denodeify';
import extend  from 'extend';
import fs from 'fs';
import fse from 'fs-extra';
import { minify } from 'html-minifier';
import path from 'path';
import sassdocExtras from 'sassdoc-extras';
import swig from './swig';

const copy = denodeify(fse.copy, Promise);
const renderFile = denodeify(swig.renderFile, Promise);
const writeFile = denodeify(fs.writeFile, Promise);

const applyDefaults = ctx =>
  extend({}, def, ctx, {
    groups: extend(def.groups, ctx.groups),
    display: extend(def.display, ctx.display),
  });

const shortcutIcon = (dest, ctx) => {
  if (!ctx.shortcutIcon) {
    ctx.shortcutIcon = { type: 'internal', url: 'assets/images/favicon.png' };
  } else if (ctx.shortcutIcon.type === 'internal') {
    ctx.shortcutIcon.url = 'assets/images/' + ctx.shortcutIcon.url;

    return () =>
      copy(ctx.shortcutIcon.path, path.resolve(dest, ctx.shortcutIcon.url));
  }
};

export default (dest, ctx) => {
  ctx = applyDefaults(ctx);

  sassdocExtras.markdown(ctx);
  sassdocExtras.display(ctx);
  sassdocExtras.groupName(ctx);
  sassdocExtras.shortcutIcon(ctx);

  ctx.data.byGroupAndType = sassdocExtras.byGroupAndType(ctx.data);

  const index = path.resolve(__dirname, '../views/documentation/index.html.swig');

  return Promise.all([
    copy('assets', path.resolve(dest, 'assets'))
      .then(shortcutIcon(dest, ctx)),

    renderFile(index, ctx)
      .then(html => minify(html, { collapseWhitespace: true }))
      .then(html => writeFile(path.resolve(dest, 'index.html'), html)),
  ]);
};
