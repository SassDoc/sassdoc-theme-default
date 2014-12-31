{% if item.deprecated %}
  <div class="item__deprecated"><strong>Deprecated!</strong> {{ item.deprecated|default("")|safe }}</div>
{% endif %}
