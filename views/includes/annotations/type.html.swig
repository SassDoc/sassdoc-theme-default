{% if item.type %}
  <h3 class="item__sub-heading">Type</h3>

  <p>
  {% if item.type == "*" %}
    Any
  {% else %}
    <code>{{ item.type|split('|')|trim|capitalize|join('</code>, <code>')|safe }}</code>
  {% endif %}
  </p>
{% endif %}
