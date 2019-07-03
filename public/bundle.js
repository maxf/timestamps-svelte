
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/App.svelte generated by Svelte v3.6.3 */

    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.t = list[i];
    	return child_ctx;
    }

    // (108:0) {:else}
    function create_else_block(ctx) {
    	var button0, t1, button1, t3, div, input0, t4, input1, t5, input2, t6, input3, dispose;

    	return {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Add";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t3 = space();
    			div = element("div");
    			input0 = element("input");
    			t4 = text("/");
    			input1 = element("input");
    			t5 = text("\n    @\n    ");
    			input2 = element("input");
    			t6 = text(":");
    			input3 = element("input");
    			attr(button0, "class", "big add svelte-1xxgnt1");
    			add_location(button0, file, 108, 2, 2471);
    			attr(button1, "class", "big svelte-1xxgnt1");
    			add_location(button1, file, 109, 2, 2534);
    			attr(input0, "class", "date-2 svelte-1xxgnt1");
    			attr(input0, "inputmode", "numeric");
    			add_location(input0, file, 111, 4, 2631);
    			attr(input1, "class", "date-2 svelte-1xxgnt1");
    			attr(input1, "inputmode", "numeric");
    			add_location(input1, file, 111, 88, 2715);
    			attr(input2, "class", "date-2 svelte-1xxgnt1");
    			attr(input2, "inputmode", "numeric");
    			add_location(input2, file, 113, 4, 2810);
    			attr(input3, "class", "date-2 svelte-1xxgnt1");
    			attr(input3, "inputmode", "numeric");
    			add_location(input3, file, 113, 89, 2895);
    			attr(div, "class", "date-input svelte-1xxgnt1");
    			add_location(div, file, 110, 2, 2602);

    			dispose = [
    				listen(button0, "click", ctx.addTimestamp),
    				listen(button1, "click", ctx.cancelAddTimestamp),
    				listen(input0, "input", ctx.input0_input_handler),
    				listen(input1, "input", ctx.input1_input_handler),
    				listen(input2, "input", ctx.input2_input_handler),
    				listen(input3, "input", ctx.input3_input_handler)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, button0, anchor);
    			insert(target, t1, anchor);
    			insert(target, button1, anchor);
    			insert(target, t3, anchor);
    			insert(target, div, anchor);
    			append(div, input0);

    			input0.value = ctx.appState.newTimestamp.date;

    			append(div, t4);
    			append(div, input1);

    			input1.value = ctx.appState.newTimestamp.month;

    			append(div, t5);
    			append(div, input2);

    			input2.value = ctx.appState.newTimestamp.hours;

    			append(div, t6);
    			append(div, input3);

    			input3.value = ctx.appState.newTimestamp.minutes;
    		},

    		p: function update(changed, ctx) {
    			if (changed.appState && (input0.value !== ctx.appState.newTimestamp.date)) input0.value = ctx.appState.newTimestamp.date;
    			if (changed.appState && (input1.value !== ctx.appState.newTimestamp.month)) input1.value = ctx.appState.newTimestamp.month;
    			if (changed.appState && (input2.value !== ctx.appState.newTimestamp.hours)) input2.value = ctx.appState.newTimestamp.hours;
    			if (changed.appState && (input3.value !== ctx.appState.newTimestamp.minutes)) input3.value = ctx.appState.newTimestamp.minutes;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button0);
    				detach(t1);
    				detach(button1);
    				detach(t3);
    				detach(div);
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (106:0) {#if !appState.newTimestamp}
    function create_if_block_1(ctx) {
    	var button, dispose;

    	return {
    		c: function create() {
    			button = element("button");
    			button.textContent = "New";
    			attr(button, "class", "big svelte-1xxgnt1");
    			add_location(button, file, 106, 2, 2397);
    			dispose = listen(button, "click", ctx.prepareNewTimestamp);
    		},

    		m: function mount(target, anchor) {
    			insert(target, button, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button);
    			}

    			dispose();
    		}
    	};
    }

    // (118:0) {#if appState.timestamps.length }
    function create_if_block(ctx) {
    	var ul, t0, button0, t2, button1, dispose;

    	var each_value = ctx.appState.timestamps;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			ul = element("ul");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "Copy";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Reset";
    			add_location(ul, file, 118, 2, 3034);
    			attr(button0, "class", "small svelte-1xxgnt1");
    			add_location(button0, file, 125, 2, 3225);
    			attr(button1, "class", "small svelte-1xxgnt1");
    			add_location(button1, file, 126, 2, 3279);

    			dispose = [
    				listen(button0, "click", ctx.copy),
    				listen(button1, "click", ctx.reset)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, ul, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert(target, t0, anchor);
    			insert(target, button0, anchor);
    			insert(target, t2, anchor);
    			insert(target, button1, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.formatTimestamp || changed.appState) {
    				each_value = ctx.appState.timestamps;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(ul);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach(t0);
    				detach(button0);
    				detach(t2);
    				detach(button1);
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (120:4) {#each appState.timestamps as t}
    function create_each_block(ctx) {
    	var li, t0_value = ctx.formatTimestamp(ctx.t), t0, t1, button, t3, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	return {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Delete";
    			t3 = space();
    			attr(button, "class", "small svelte-1xxgnt1");
    			add_location(button, file, 121, 8, 3117);
    			add_location(li, file, 120, 6, 3082);
    			dispose = listen(button, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, t0);
    			append(li, t1);
    			append(li, button);
    			append(li, t3);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.appState) && t0_value !== (t0_value = ctx.formatTimestamp(ctx.t))) {
    				set_data(t0, t0_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			dispose();
    		}
    	};
    }

    function create_fragment(ctx) {
    	var h1, t1, t2, if_block1_anchor;

    	function select_block_type(ctx) {
    		if (!ctx.appState.newTimestamp) return create_if_block_1;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block0 = current_block_type(ctx);

    	var if_block1 = (ctx.appState.timestamps.length) && create_if_block(ctx);

    	return {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Timestamps";
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(h1, file, 104, 0, 2346);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			if_block0.m(target, anchor);
    			insert(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(changed, ctx);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);
    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t2.parentNode, t2);
    				}
    			}

    			if (ctx.appState.timestamps.length) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h1);
    				detach(t1);
    			}

    			if_block0.d(detaching);

    			if (detaching) {
    				detach(t2);
    			}

    			if (if_block1) if_block1.d(detaching);

    			if (detaching) {
    				detach(if_block1_anchor);
    			}
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	const appState = {
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
       }; $$invalidate('appState', appState);
     };

     const addTimestamp = () => {
       const d = appState.newTimestamp;
       appState.timestamps.push(new Date(d.year, d.month, d.date, d.hours, d.minutes));
       localStorage.setItem('timestamps', JSON.stringify(appState.timestamps));
       appState.newTimestamp = null; $$invalidate('appState', appState);
     };

     const deleteTimestamp = (timestampToRemove) => {
       appState.timestamps =
         appState.timestamps.filter(t => t !== timestampToRemove); $$invalidate('appState', appState);
     };

     const cancelAddTimestamp = () => { const $$result = appState.newTimestamp = null; $$invalidate('appState', appState); return $$result; };

     const reset = () => {
       appState.timestamps = []; $$invalidate('appState', appState);
       appState.newTimestamp = null; $$invalidate('appState', appState);
       localStorage.setItem('timestamps','[]');
     };

     // copy the timestamps to the clipboard
     const copy = () => {
       const copyText = appState.timestamps
         .map(formatTimestamp)
         .join();
       navigator.clipboard.writeText(copyText);
     };

    	function input0_input_handler() {
    		appState.newTimestamp.date = this.value;
    		$$invalidate('appState', appState);
    	}

    	function input1_input_handler() {
    		appState.newTimestamp.month = this.value;
    		$$invalidate('appState', appState);
    	}

    	function input2_input_handler() {
    		appState.newTimestamp.hours = this.value;
    		$$invalidate('appState', appState);
    	}

    	function input3_input_handler() {
    		appState.newTimestamp.minutes = this.value;
    		$$invalidate('appState', appState);
    	}

    	function click_handler({ t }) {
    		return deleteTimestamp(t);
    	}

    	return {
    		appState,
    		formatTimestamp,
    		prepareNewTimestamp,
    		addTimestamp,
    		deleteTimestamp,
    		cancelAddTimestamp,
    		reset,
    		copy,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		click_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
