{% if item.deprecated %}
  <p class="item__deprecated"><strong>Deprecated!</strong> {{ item.deprecated[0]|default("")|safe }}</p>
{% endif %}