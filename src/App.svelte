<script>
 import { onMount } from 'svelte';

 let appState = {
   timestamps: [], // array of Date
   newTimestamp: null // null or { date, month, year, hours, minutes }
 };

 const formatTimestamp = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`;

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
   localStorage.setItem('timestamps', JSON.stringify(appState.timestamps));
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
   localStorage.setItem('timestamps','[]');
 };

 // copy the timestamps to the clipboard
 const copy = () => {
   const copyText = appState.timestamps
     .map(formatTimestamp)
     .join();
   navigator.clipboard.writeText(copyText);
 };


 const updateFromLocalStorage = function() {
   const savedValue = localStorage.getItem('timestamps') || [];
   const newAppState = appState;
   try {
     newAppState.timestamps = JSON.parse(savedValue).map(isoDate => new Date(Date.parse(isoDate)));
   } catch (error) {
     newAppState.timestamps = [];
     localStorage.setItem('timestamps', '[]');
   }
   return newAppState;
 };

 onMount(() => {
   appState = updateFromLocalStorage();
 });

</script>

<!-- ############################################################################### -->

<style>
  .date-2 { width: 2em; }

  .date-4 { width: 4em; }

  body * {
    font-size: 20px;
    font-family: sans-serif;
  }

  button {
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
 </style>



<!-- ############################################################################### -->

<h1>Timestamps</h1>
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
