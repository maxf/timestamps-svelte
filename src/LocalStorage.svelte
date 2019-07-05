<script>
  import { onMount } from 'svelte';

  let model = window.localStorage.getItem('timestamps');

  onMount(() => {
    setInterval(
      () => { model = window.localStorage.getItem('timestamps'); },
      3000
    );
  });


</script>

<style>
  #main {
    background: #ff8;
    padding: 4px;
  }
</style>

<div id="main">
  {model}
</div>
