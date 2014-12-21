{% if item.htmlTodos.length > 0 %}
  <h3 class="item__sub-heading">TODO's</h3>

  <ul class="list-unstyled">
    {% for todo in item.htmlTodos %}
      <li>{{ todo | safe }}</li>
    {% endfor %}
  </ul>
{% endif %}
