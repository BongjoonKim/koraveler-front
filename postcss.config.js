<artifacts>
  <invoke name="artifacts">
    <parameter name="command">update</parameter>
    <parameter name="id">postcss_config</parameter>
    <parameter name="old_str">module.exports = {
      plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
    }</parameter>
    <parameter name="new_str">module.exports = {
      plugins: [
      require('@tailwindcss/postcss'),
      require('autoprefixer'),
      ],
    }</parameter>
  </invoke>
</artifacts>