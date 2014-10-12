{% if item.return %}
  <h3 class="item__sub-heading">Returns</h3>

  <p class="sassdoc__item-description">{% if item.return[0].description %}{{ item.return[0].description|safe }}{% endif %}
  {% if item.return[0].type == '*' %}
    Any
  {% else %}
    {{ item.return[0].type|split('|')|trim|capitalize|join(', ') }}
  {% endif %}
  </p>
{% endif %}
