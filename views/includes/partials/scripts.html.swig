<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="assets/js/vendor/jquery.min.js"><\/script>')</script>
{% if googleAnalytics %}
<script>
  var _gaq = [['_setAccount', '{{ googleAnalytics }}'], ['_trackPageview']];
  (function(d) {
    var g = d.createElement('script'),
        s = d.scripts[0];
    g.src = '//ssl.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g, s);
  }(document));
</script>
{% endif %}
{% if trackingCode %}
{{ trackingCode }}
{% endif %}
<script src="assets/js/main.min.js"></script>
