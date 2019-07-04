import TimestampManager from './TimestampManager.svelte';

const ts1 = new TimestampManager({
  target: document.getElementById('ts1'),
  props: {
    name: 'TS1'
  }
});

const ts2 = new TimestampManager({
  target: document.getElementById('ts2'),
  props: {
    name: 'TS2'
  }
});

//export default ts1;
//export default ts2;
