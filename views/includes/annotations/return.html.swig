{% if item.return %}
  <h3 class="item__sub-heading">Returns</h3>

  <p class="item__description">{% if item.return.description %}{{ item.return.description|safe }}{% endif %}
  {% if item.return.type == '*' %}
    Any
  {% else %}
    <code>{{ item.return.type | display_as_type }}</code>
  {% endif %}
  </p>
{% endif %}
