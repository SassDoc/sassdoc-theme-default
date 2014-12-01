{% if item.return %}
  <h3 class="item__sub-heading">Returns</h3>

  <p class="item__description">{% if item.return.description %}{{ item.return.description|safe }}{% endif %}
  {% if item.return.type == '*' %}
    Any
  {% else %}
    <code>{{ item.return.type|split('|')|trim|capitalize|join('</code>, <code>')|safe }}</code>
  {% endif %}
  </p>
{% endif %}
