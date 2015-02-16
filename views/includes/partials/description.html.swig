{% if description or package.description %}
<section class="main__section">
  <h1 class="main__heading" id="introduction">
    <div class="container">Introduction</div>
  </h1>
  <div class="container">
  {% if description %}
    {{ description | raw }}
  {% elseif package.description %}
    {{ package.description | raw }}
  {% endif %}
  </div>
</section>
{% endif %}
