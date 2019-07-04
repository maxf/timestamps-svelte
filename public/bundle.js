!function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function a(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function o(t,e){t.appendChild(e)}function p(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function m(t){return document.createElement(t)}function l(t){return document.createTextNode(t)}function c(){return l(" ")}function u(t,e,n,a){return t.addEventListener(e,n,a),()=>t.removeEventListener(e,n,a)}function d(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function f(t,e){e=""+e,t.data!==e&&(t.data=e)}let h;function g(t){h=t}function v(t){(function(){if(!h)throw new Error("Function called outside component initialization");return h})().$$.on_mount.push(t)}const S=[],$=[],w=[],T=[],_=Promise.resolve();let y=!1;function b(t){w.push(t)}function x(){const t=new Set;do{for(;S.length;){const t=S.shift();g(t),k(t.$$)}for(;$.length;)$.pop()();for(;w.length;){const e=w.pop();t.has(e)||(e(),t.add(e))}}while(S.length);for(;T.length;)T.pop()();y=!1}function k(t){t.fragment&&(t.update(t.dirty),a(t.before_render),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_render.forEach(b))}const N=new Set;function C(t,e){t.$$.dirty||(S.push(t),y||(y=!0,_.then(x)),t.$$.dirty=n()),t.$$.dirty[e]=!0}function E(s,o,p,i,m,l){const c=h;g(s);const u=o.props||{},d=s.$$={fragment:null,ctx:null,props:l,update:t,not_equal:m,bound:n(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(c?c.$$.context:[]),callbacks:n(),dirty:null};let f=!1;var v,S,$;d.ctx=p?p(s,u,(t,e)=>{d.ctx&&m(d.ctx[t],d.ctx[t]=e)&&(d.bound[t]&&d.bound[t](e),f&&C(s,t))}):u,d.update(),f=!0,a(d.before_render),d.fragment=i(d.ctx),o.target&&(o.hydrate?d.fragment.l(($=o.target,Array.from($.childNodes))):d.fragment.c(),o.intro&&((v=s.$$.fragment)&&v.i&&(N.delete(v),v.i(S))),function(t,n,s){const{fragment:o,on_mount:p,on_destroy:i,after_render:m}=t.$$;o.m(n,s),b(()=>{const n=p.map(e).filter(r);i?i.push(...n):a(n),t.$$.on_mount=[]}),m.forEach(b)}(s,o.target,o.anchor),x()),g(c)}class I{$destroy(){var e,n;n=1,(e=this).$$.fragment&&(a(e.$$.on_destroy),e.$$.fragment.d(n),e.$$.on_destroy=e.$$.fragment=null,e.$$.ctx={}),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function O(t,e,n){const a=Object.create(t);return a.t=e[n],a}function D(t){var e,n,r,s,f,h,g,v,S,$,w,T,_;return{c(){(e=m("button")).textContent="Add",n=c(),(r=m("button")).textContent="Cancel",s=c(),f=m("div"),h=m("input"),g=l("/"),v=m("input"),S=l("\n    @\n    "),$=m("input"),w=l(":"),T=m("input"),d(e,"class","big add svelte-1t59drc"),d(r,"class","big svelte-1t59drc"),d(h,"class","date-2 svelte-1t59drc"),d(h,"inputmode","numeric"),d(v,"class","date-2 svelte-1t59drc"),d(v,"inputmode","numeric"),d($,"class","date-2 svelte-1t59drc"),d($,"inputmode","numeric"),d(T,"class","date-2 svelte-1t59drc"),d(T,"inputmode","numeric"),d(f,"class","date-input svelte-1t59drc"),_=[u(e,"click",t.addTimestamp),u(r,"click",t.cancelAddTimestamp),u(h,"input",t.input0_input_handler),u(v,"input",t.input1_input_handler),u($,"input",t.input2_input_handler),u(T,"input",t.input3_input_handler)]},m(a,i){p(a,e,i),p(a,n,i),p(a,r,i),p(a,s,i),p(a,f,i),o(f,h),h.value=t.appState.newTimestamp.date,o(f,g),o(f,v),v.value=t.appState.newTimestamp.month,o(f,S),o(f,$),$.value=t.appState.newTimestamp.hours,o(f,w),o(f,T),T.value=t.appState.newTimestamp.minutes},p(t,e){t.appState&&h.value!==e.appState.newTimestamp.date&&(h.value=e.appState.newTimestamp.date),t.appState&&v.value!==e.appState.newTimestamp.month&&(v.value=e.appState.newTimestamp.month),t.appState&&$.value!==e.appState.newTimestamp.hours&&($.value=e.appState.newTimestamp.hours),t.appState&&T.value!==e.appState.newTimestamp.minutes&&(T.value=e.appState.newTimestamp.minutes)},d(t){t&&(i(e),i(n),i(r),i(s),i(f)),a(_)}}}function A(e){var n,a;return{c(){(n=m("button")).textContent="New",d(n,"class","big svelte-1t59drc"),a=u(n,"click",e.prepareNewTimestamp)},m(t,e){p(t,n,e)},p:t,d(t){t&&i(n),a()}}}function J(t){for(var e,n,r,s,o,l,f=t.appState.timestamps,h=[],g=0;g<f.length;g+=1)h[g]=M(O(t,f,g));return{c(){e=m("ul");for(var a=0;a<h.length;a+=1)h[a].c();n=c(),(r=m("button")).textContent="Copy",s=c(),(o=m("button")).textContent="Reset",d(e,"class","svelte-1t59drc"),d(r,"class","small svelte-1t59drc"),d(o,"class","small svelte-1t59drc"),l=[u(r,"click",t.copy),u(o,"click",t.reset)]},m(t,a){p(t,e,a);for(var i=0;i<h.length;i+=1)h[i].m(e,null);p(t,n,a),p(t,r,a),p(t,s,a),p(t,o,a)},p(t,n){if(t.formatTimestamp||t.appState){f=n.appState.timestamps;for(var a=0;a<f.length;a+=1){const r=O(n,f,a);h[a]?h[a].p(t,r):(h[a]=M(r),h[a].c(),h[a].m(e,null))}for(;a<h.length;a+=1)h[a].d(1);h.length=f.length}},d(t){t&&i(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(h,t),t&&(i(n),i(r),i(s),i(o)),a(l)}}}function M(t){var e,n,a,r,s,h,g=t.formatTimestamp(t.t);function v(){return t.click_handler(t)}return{c(){e=m("li"),n=l(g),a=c(),(r=m("button")).textContent="Delete",s=c(),d(r,"class","small svelte-1t59drc"),d(e,"class","svelte-1t59drc"),h=u(r,"click",v)},m(t,i){p(t,e,i),o(e,n),o(e,a),o(e,r),o(e,s)},p(e,a){t=a,e.appState&&g!==(g=t.formatTimestamp(t.t))&&f(n,g)},d(t){t&&i(e),h()}}}function j(e){var n,a,r,s,u;function h(t){return t.appState.newTimestamp?D:A}var g=h(e),v=g(e),S=e.appState.timestamps.length&&J(e);return{c(){n=m("div"),a=m("h1"),r=l(e.name),s=c(),v.c(),u=c(),S&&S.c(),d(n,"class","component svelte-1t59drc")},m(t,e){p(t,n,e),o(n,a),o(a,r),o(n,s),v.m(n,null),o(n,u),S&&S.m(n,null)},p(t,e){t.name&&f(r,e.name),g===(g=h(e))&&v?v.p(t,e):(v.d(1),(v=g(e))&&(v.c(),v.m(n,u))),e.appState.timestamps.length?S?S.p(t,e):((S=J(e)).c(),S.m(n,null)):S&&(S.d(1),S=null)},i:t,o:t,d(t){t&&i(n),v.d(),S&&S.d()}}}function B(t,e,n){let{name:a}=e;const r={timestamps:[],newTimestamp:null},s=t=>`${t.getDate()}/${t.getMonth()+1}/${t.getFullYear()} - ${t.getHours()}:${t.getMinutes()}`,o=t=>{r.timestamps=r.timestamps.filter(e=>e!==t),n("appState",r)};return v(()=>{r.timestamps=(t=>{const e=localStorage.getItem("timestamps");try{return JSON.parse(e)[t].map(t=>new Date(Date.parse(t)))}catch(t){return console.log("failed to parse localstorage data 1",t),[]}})(a),n("appState",r),r.newTimestamp=null,n("appState",r)}),t.$set=(t=>{"name"in t&&n("name",a=t.name)}),{name:a,appState:r,formatTimestamp:s,prepareNewTimestamp:()=>{var t=new Date;r.newTimestamp={date:t.getDate(),month:t.getMonth(),year:t.getFullYear(),hours:t.getHours(),minutes:t.getMinutes()},n("appState",r)},addTimestamp:()=>{const t=r.newTimestamp;r.timestamps.push(new Date(t.year,t.month,t.date,t.hours,t.minutes)),((t,e)=>{const n=localStorage.getItem("timestamps")||"{}";let a;try{a=JSON.parse(n)}catch(t){console.log("failed to parse localstorage data 2",t),a={}}a[t]=e,localStorage.setItem("timestamps",JSON.stringify(a))})(a,r.timestamps),r.newTimestamp=null,n("appState",r)},deleteTimestamp:o,cancelAddTimestamp:()=>{const t=r.newTimestamp=null;return n("appState",r),t},reset:()=>{r.timestamps=[],n("appState",r),r.newTimestamp=null,n("appState",r),(t=>{const e=localStorage.getItem("timestamps");try{const n=JSON.parse(e);delete n[t],localStorage.setItem("timestamps",JSON.stringify(n))}catch(t){console.log("failed to parse localstorage data 3",t),localStorage.removeItem("timestamps")}})(a)},copy:()=>{const t=r.timestamps.map(s).join();navigator.clipboard.writeText(t)},input0_input_handler:function(){r.newTimestamp.date=this.value,n("appState",r)},input1_input_handler:function(){r.newTimestamp.month=this.value,n("appState",r)},input2_input_handler:function(){r.newTimestamp.hours=this.value,n("appState",r)},input3_input_handler:function(){r.newTimestamp.minutes=this.value,n("appState",r)},click_handler:function({t:t}){return o(t)}}}class F extends I{constructor(t){super(),E(this,t,B,j,s,["name"])}}new F({target:document.getElementById("ts1"),props:{name:"TS1"}}),new F({target:document.getElementById("ts2"),props:{name:"TS2"}})}();
//# sourceMappingURL=bundle.js.map
