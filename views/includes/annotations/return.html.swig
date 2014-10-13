{% if item.return %}
  <h3 class="item__sub-heading">Returns</h3>

  <p class="sassdoc__item-description">{% if item.return.description %}{{ item.return.description|safe }}{% endif %}
  {% if item.return.type == '*' %}
    Any
  {% else %}
    {{ item.return.type|split('|')|trim|capitalize|join(', ') }}
  {% endif %}
  </p>
{% endif %}
