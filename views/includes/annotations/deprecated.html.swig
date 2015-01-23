{% if item.deprecated or item.deprecated == "" %}
  <div class="item__deprecated"><strong>Deprecated!</strong> {{ item.deprecated|safe }}</div>
{% endif %}
