{% if item.example.length > 0 %}
  <h3 class="item__sub-heading">Example</h3>

  {% for example in item.example %}
  <div class="item__example  example">
    {% if example.description %}
    <div class="example__description">{{ example.description|safe }}</div>
    {% endif %}
    <pre class="example__code"><code class="language-{{ example.type }}">{{ example.code|escape|safe }}</code></pre>
  </div>
  {% endfor %}
{% endif %}
