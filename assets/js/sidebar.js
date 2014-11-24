(function ($, global) {

  var Sidebar = function (conf) {
    this.conf = $.extend({

      // Collapsed class
      collapsedClass: 'is-collapsed',

      // Index attribute
      indexAttribute: 'data-slug',

      // Toggle button
      toggleBtn: '.js-btn-toggle',

      // Initial collapse
      initialCollapse: true,

      // Automatic initialization
      init: true
    }, conf || {});

    if (this.conf.init === true) {
      this.initialize();
    }
  };

  /**
   * Initialize module
   */
  Sidebar.prototype.initialize = function () {
    this.conf.nodes = $('[' + this.conf.indexAttribute + ']');

    this.index = this.buildIndex();
    this.bind();
  };

  /**
   * Build a fresh index
   */
  Sidebar.prototype.buildIndex = function () {
    var index = {};
    var $item;

    this.conf.nodes.each($.proxy(function (index, item) {
      $item = $(item);

      index[$item.attr(this.conf.indexAttribute)] = !$item.hasClass(this.conf.collapsedClass);
    }, this));

    return index;
  };

  /**
   * Bind UI events
   */
  Sidebar.prototype.bind = function () {
    var $item, slug, fn, text;
    var $toggleBtn = $(this.conf.toggleBtn);
    var collapsed = false;

    // Toggle all
    $toggleBtn.on('click', $.proxy(function (event) {
      $node = $(event.target);

      text = $node.attr('data-alt');
      $node.attr('data-alt', $node.text());
      $node.text(text);

      fn = collapsed === true ? 'removeClass' : 'addClass';

      this.conf.nodes.each($.proxy(function (index, item) {
        $item = $(item);
        slug = $item.attr(this.conf.indexAttribute);

        this.index[slug] = collapsed;

        $('[' + this.conf.indexAttribute + '="' + slug + '"]')[fn](this.conf.collapsedClass);
      }, this));

      collapsed = !collapsed;
    }, this));

    if (this.conf.initialCollapse !== false) {
      $toggleBtn.trigger('click');
    }

    // Toggle item
    this.conf.nodes.on('click', $.proxy(function (event) {
      $item = $(event.target);
      slug = $item.attr(this.conf.indexAttribute);

      // Update index
      this.index[slug] = !this.index[slug];

      // Update DOM
      $item.toggleClass(this.conf.collapsedClass);
    }, this));
  };

  global.Sidebar = Sidebar;

}(window.jQuery, window));
