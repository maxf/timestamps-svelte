import TimestampManager from './TimestampManager.svelte';
//import LocalStorage from './LocalStorage.svelte';

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

//const ls = new LocalStorage({
//  target: document.getElementById('ls')
//});
