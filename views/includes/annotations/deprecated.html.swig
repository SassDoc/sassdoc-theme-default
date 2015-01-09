{% if item.deprecated %}
  <p class="item__deprecated"><strong>Deprecated!</strong> {{ item.deprecated|default("")|safe }}</p>
{% endif %}
