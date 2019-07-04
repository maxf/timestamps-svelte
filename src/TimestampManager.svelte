<script>
 import { onMount } from 'svelte';

 export let name;

 const appState = {
   timestamps: [], // array of Date
   newTimestamp: null // null or { date, month, year, hours, minutes }
 };

 const formatTimestamp = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`;


 const getFromLocalStorage = name => {
   const storedData = localStorage.getItem('timestamps');
   try {
     const data = JSON.parse(storedData)[name];
     return data.map(isoDate => new Date(Date.parse(isoDate)));
   } catch (error) {
     console.log('failed to parse localstorage data 1', error);
     return [];
   }
 };

 const saveToLocalStorage = (name, timestamps) => {
   const storedData = localStorage.getItem('timestamps') || '{}';
   let data;
   try {
     data = JSON.parse(storedData);
   } catch (error) {
     console.log('failed to parse localstorage data 2', error);
     data = {};
   }
   data[name] = timestamps;
   localStorage.setItem('timestamps', JSON.stringify(data));
 };

 const deleteFromLocalStorage = name => {
   const storedData = localStorage.getItem('timestamps');
   try {
     const data = JSON.parse(storedData);
     delete data[name];
     localStorage.setItem('timestamps', JSON.stringify(data));
   } catch (error) {
     console.log('failed to parse localstorage data 3', error);
     localStorage.removeItem('timestamps');
   }
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
   saveToLocalStorage(name, appState.timestamps);
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
    background: #ddd;
    border-radius: 10px;
    padding: 10px;
    width: 250px;
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

 </style>


<!-- ############################################################################### -->

<div class="component">
  <h1>{name}</h1>
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
