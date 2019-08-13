<script>
 import { onMount } from 'svelte';

 export let name;

 const appState = {
   timestamps: [], // array of Date
   newTimestamp: null, // null or { date, month1, year, hours, minutes }
   errorMessage: null
 };

 const pad = (n, d) => n.toString().padStart(d, '0');

 const formatTimestamp = d =>
   `${d.getDate()}/${d.getMonth() + 1}/${pad(d.getFullYear(),4)}`
                          + ', '
                          + `${d.getHours()}:${pad(d.getMinutes(),2)}`
                          + '\n';

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
     month1: now.getMonth() + 1,
     year: now.getFullYear(),
     hours: now.getHours(),
     minutes: now.getMinutes()
   }
 };

 const isValidDate = d => d instanceof Date && !isNaN(d);

 const addTimestamp = () => {
   const d = appState.newTimestamp;
   const newDate = new Date(d.year, d.month1 - 1, d.date, d.hours, d.minutes);
   if (isValidDate(newDate)) {
     appState.errorMessage = null;
     appState.timestamps.push(newDate);
     saveToLocalStorage(name, appState.timestamps.sort((a, b) => a-b));
     appState.newTimestamp = null;
   } else {
     appState.errorMessage = "Bad timestamp";
   }
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
                            .join('');
   navigator.clipboard.writeText(copyText);
 };

 // chart functions
 const dayOfTimestamp = t => Math.floor(t / (1000 * 3600 * 24));
 const timeOfTimestamp = t => t - dayOfTimestamp(t)*1000*3600*24;

 const chartViewBox = (timestamps) => {
   const minTs = Math.min.apply(this, timestamps);
   const maxTs = Math.max.apply(this, timestamps);
   const xmin = dayOfTimestamp(minTs);
   const xmax = dayOfTimestamp(maxTs);
   const ymin = 0;
   const ymax = 24 * 3600;
   return `${xmin} ${ymin} ${xmax-xmin+1} ${ymax-ymin}`;
 };



 // start
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

 button.del {
   font-weight: bold;
   margin-left: .5em;
   background: #ddd;
   padding: 3px;
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

 .error-message {
   color: red;
   padding-top: 1em;
 }

 .ts-list {
   height: 5em;
   overflow-y: auto;
 }

 svg {
   border: 1px solid black
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
  {#if appState.errorMessage}
  <div class="error-message">{appState.errorMessage}</div>
  {/if}
  <div class="date-input">
    <input class="date-2" bind:value={appState.newTimestamp.date} inputmode="numeric"/>/<input class="date-2" bind:value={appState.newTimestamp.month1} inputmode="numeric"/>
    @
    <input class="date-2" bind:value={appState.newTimestamp.hours} inputmode="numeric"/>:<input class="date-2" bind:value={appState.newTimestamp.minutes} inputmode="numeric"/>
  </div>
  {/if}

  {#if appState.timestamps.length }
  <ul class="ts-list">
    {#each appState.timestamps.sort((a,b) => b - a) as t}
    <li>{ formatTimestamp(t) }
      <button class="del" on:click={() => deleteTimestamp(t)}>❌</button>
    </li>
    {/each}
  </ul>
  <button class="small" on:click={copy}>Copy</button>
  <button class="small" on:click={reset}>Reset</button>

  <svg viewBox="{ chartViewBox(appState.timestamps) }" preserveAspectRatio="none" width="100%" height="200px">
    <rect x="18120" y="0" width="5" height="86400" fill="#ddd"/>
    {#each appState.timestamps as t}
    <rect x="{dayOfTimestamp(t)}" y="{timeOfTimestamp(t)/1000}" width="1" height="1000" fill="red"/>
    {/each}
  </svg>



  {/if}
</div>
