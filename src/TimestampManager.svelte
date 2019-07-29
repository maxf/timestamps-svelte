<script>
  import { onMount } from 'svelte';

  export let name;

  const appState = {
    timestamps: [], // array of Date
    newTimestamp: null // null or { date, month, year, hours, minutes }
  };

  const pad = (n, d) => n.toString().padStart(d, '0');



  const formatTimestamp = d => `
    ${d.getDate()}/${d.getMonth() + 1}/${pad(d.getFullYear(),4)} -
    ${d.getHours()}:${pad(d.getMinutes(),2)}`;


  const isObject = a => (!!a) && (a.constructor === Object);

  const getSavedData = () => {
    const storedDataString = localStorage.getItem('timestamps');
    let parsedDataObject;
    try {
      parsedDataObject = JSON.parse(storedDataString);
    } catch (error) {
      console.log('failed to parse localstorage json.');
      parsedDataObject = null;
    }
    if (!isObject(parsedDataObject)) {
      console.log('localstorage is not an object. Resetting to {}');
      localStorage.setItem('timestamps', '{}');
      parsedDataObject = {};
    }
    return parsedDataObject;
  }

  const getFromLocalStorage = name => {
    const localData = getSavedData();
    return localData[name] ?
      localData[name].map(isoDate => new Date(Date.parse(isoDate)))
      : [];
  };

  const saveToLocalStorage = (name, timestamps) => {
    const localData = getSavedData();
    localData[name] = timestamps;
    localStorage.setItem('timestamps', JSON.stringify(localData));
  };

  const deleteFromLocalStorage = name => {
    const localData = getSavedData();
    delete localData[name];
    localStorage.setItem('timestamps', JSON.stringify(localData));
  };

  const prepareNewTimestamp = () => {
    var now = new Date();
    appState.newTimestamp = {
      date: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
      hours: now.getHours(),
      minutes: now.getMinutes(),
    }
  };

 const addTimestamp = () => {
   const d = appState.newTimestamp;
   appState.timestamps.push(new Date(d.year, d.month, d.date, d.hours, d.minutes));
   saveToLocalStorage(name, appState.timestamps.sort((a, b) => a-b));
   appState.newTimestamp = null;
 };

 const deleteTimestamp = (timestampToRemove) => {
   appState.timestamps =
     appState.timestamps.filter(t => t !== timestampToRemove);
 };

 const cancelAddTimestamp = () => appState.newTimestamp = null;

 const reset = () => {
   appState.timestamps = [];
   appState.newTimestamp = null;
   deleteFromLocalStorage(name);
 };

 // copy the timestamps to the clipboard
 const copy = () => {
   const copyText = appState.timestamps
     .map(formatTimestamp)
     .join();
   navigator.clipboard.writeText(copyText);
 };

 onMount(() => {
   appState.timestamps = getFromLocalStorage(name);
   appState.newTimestamp = null;
 });

</script>

<!-- ############################################################################### -->

<style>

  .component {
    border: 1px solid #64f;
    margin: 3px;
    background: white;
    border-radius: 10px;
    padding: 10px;
    width: 206px;
  }

  .date-2 { width: 2em; }

  .date-4 { width: 4em; }

  button {
    padding: 0;
    border: 1px solid white;
    border-radius: 10px;
    background: #32f;
    color: white;
  }

  button:active {
    background: #118;
  }

  .date-input {
    margin-top: 1em;
  }

  button.add {
    background: #e55;
  }

  button.big {
    width: 100px;
    height: 100px;
  }

  button.small {
    width: 80px;
    height: 30px;
  }

  ul {
    padding-left: 0;
  }

  li {
    list-style-type: none;
  }

  h1 {
    font-size: 30px;
    margin: 0 0 10px 0;
  }

 </style>


<!-- ############################################################################### -->

<div class="component">
  <h1><img src="clock-icon-192.png" alt="clock icon" height="20px"/> {name}</h1>
  {#if !appState.newTimestamp}
  <button class="big" on:click={prepareNewTimestamp}>New</button>
  {:else}
  <button class="big add" on:click={addTimestamp}>Add</button>
  <button class="big" on:click={cancelAddTimestamp}>Cancel</button>
  <div class="date-input">
    <input class="date-2" bind:value={appState.newTimestamp.date} inputmode="numeric"/>/<input class="date-2" bind:value={appState.newTimestamp.month} inputmode="numeric"/>
    @
    <input class="date-2" bind:value={appState.newTimestamp.hours} inputmode="numeric"/>:<input class="date-2" bind:value={appState.newTimestamp.minutes} inputmode="numeric"/>
  </div>
  {/if}

  {#if appState.timestamps.length }
  <ul>
    {#each appState.timestamps as t}
    <li>{ formatTimestamp(t) }
      <button class="small" on:click={() => deleteTimestamp(t)}>Delete</button>
    </li>
    {/each}
  </ul>
  <button class="small" on:click={copy}>Copy</button>
  <button class="small" on:click={reset}>Reset</button>
  {/if}
</div>
