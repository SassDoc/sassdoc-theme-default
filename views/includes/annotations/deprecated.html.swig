{% if item.deprecated != false %}
  <div class="item__deprecated"><strong>Deprecated!</strong> {{ item.deprecated|safe }}</div>
{% endif %}
