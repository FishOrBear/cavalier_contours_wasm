let wasm;

export async function initWasm()
{
    wasm = await import("./cavalier_contours_web_ffi_bg.wasm");
    return wasm;
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj)
{
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0()
{
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len)
{
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx)
{
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx)
{
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val)
{
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for (let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view)
    {
        return cachedTextEncoder.encodeInto(arg, view);
    }
    : function (arg, view)
    {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

function passStringToWasm0(arg, malloc, realloc)
{

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0()
{
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
*/
export function greet()
{
    wasm.greet();
}

/**
*/
export function init()
{
    wasm.init();
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0()
{
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function passArrayF64ToWasm0(arg, malloc)
{
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0()
{
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len)
{
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayF64FromWasm0(ptr, len)
{
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}

function _assertClass(instance, klass)
{
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function handleError(f)
{
    return function ()
    {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}
/**
*/
export class Polyline
{

    static __wrap(ptr)
    {
        const obj = Object.create(Polyline.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw()
    {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free()
    {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_polyline_free(ptr);
    }
    /**
    * @param {Float64Array} vertex_data
    * @param {boolean} is_closed
    */
    constructor(vertex_data, is_closed)
    {
        var ptr0 = passArrayF64ToWasm0(vertex_data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.polyline_new(ptr0, len0, is_closed);
        return Polyline.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} bulge
    */
    add(x, y, bulge)
    {
        wasm.polyline_add(this.ptr, x, y, bulge);
    }
    /**
    */
    clear()
    {
        wasm.polyline_clear(this.ptr);
    }
    /**
    * @returns {number}
    */
    get length()
    {
        var ret = wasm.polyline_length(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} count
    */
    cycleVertexes(count)
    {
        wasm.polyline_cycleVertexes(this.ptr, count);
    }
    /**
    * @returns {Float64Array}
    */
    vertexData()
    {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.polyline_vertexData(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {boolean}
    */
    get isClosed()
    {
        var ret = wasm.polyline_is_closed(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} is_closed
    */
    set isClosed(is_closed)
    {
        wasm.polyline_set_is_closed(this.ptr, is_closed);
    }
    /**
    * @returns {number}
    */
    area()
    {
        var ret = wasm.polyline_area(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    pathLength()
    {
        var ret = wasm.polyline_pathLength(this.ptr);
        return ret;
    }
    /**
    * @param {number} scale_factor
    */
    scale(scale_factor)
    {
        wasm.polyline_scale(this.ptr, scale_factor);
    }
    /**
    * @param {number} x_offset
    * @param {number} y_offset
    */
    translate(x_offset, y_offset)
    {
        wasm.polyline_translate(this.ptr, x_offset, y_offset);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @returns {number}
    */
    windingNumber(x, y)
    {
        var ret = wasm.polyline_windingNumber(this.ptr, x, y);
        return ret;
    }
    /**
    * @param {Polyline} other
    * @param {number} operation
    * @returns {any}
    */
    boolean(other, operation)
    {
        _assertClass(other, Polyline);
        var ret = wasm.polyline_boolean(this.ptr, other.ptr, operation);
        return takeObject(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @returns {any}
    */
    closestPoint(x, y)
    {
        var ret = wasm.polyline_closestPoint(this.ptr, x, y);
        return takeObject(ret);
    }
    /**
    * @returns {StaticAABB2DIndex}
    */
    createApproxSpatialIndex()
    {
        var ret = wasm.polyline_createApproxSpatialIndex(this.ptr);
        return StaticAABB2DIndex.__wrap(ret);
    }
    /**
    * @returns {StaticAABB2DIndex}
    */
    createSpatialIndex()
    {
        var ret = wasm.polyline_createSpatialIndex(this.ptr);
        return StaticAABB2DIndex.__wrap(ret);
    }
    /**
    * @returns {Float64Array}
    */
    extents()
    {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.polyline_extents(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    */
    invertDirection()
    {
        wasm.polyline_invertDirection(this.ptr);
    }
    /**
    * @param {number} offset
    * @param {boolean} handle_self_intersects
    * @returns {Array<any>}
    */
    parallelOffset(offset, handle_self_intersects)
    {
        var ret = wasm.polyline_parallelOffset(this.ptr, offset, handle_self_intersects);
        return takeObject(ret);
    }
    /**
    * @param {number} offset
    * @returns {Polyline}
    */
    rawOffset(offset)
    {
        var ret = wasm.polyline_rawOffset(this.ptr, offset);
        return Polyline.__wrap(ret);
    }
    /**
    * @param {number} offset
    * @returns {Array<any>}
    */
    rawOffsetSegs(offset)
    {
        var ret = wasm.polyline_rawOffsetSegs(this.ptr, offset);
        return takeObject(ret);
    }
    /**
    * @returns {Array<any>}
    */
    selfIntersects()
    {
        var ret = wasm.polyline_selfIntersects(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} error_distance
    * @returns {Polyline}
    */
    arcsToApproxLines(error_distance)
    {
        var ret = wasm.polyline_arcsToApproxLines(this.ptr, error_distance);
        return Polyline.__wrap(ret);
    }
    /**
    * @param {number} error_distance
    * @returns {Float64Array}
    */
    arcsToApproxLinesData(error_distance)
    {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.polyline_arcsToApproxLinesData(retptr, this.ptr, error_distance);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {any}
    */
    testProperties()
    {
        var ret = wasm.polyline_testProperties(this.ptr);
        return takeObject(ret);
    }
    /**
    */
    logToConsole()
    {
        wasm.polyline_logToConsole(this.ptr);
    }
}
/**
*/
export class StaticAABB2DIndex
{

    static __wrap(ptr)
    {
        const obj = Object.create(StaticAABB2DIndex.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw()
    {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free()
    {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_staticaabb2dindex_free(ptr);
    }
    /**
    * @param {Float64Array} aabb_data
    * @param {number} node_size
    */
    constructor(aabb_data, node_size)
    {
        var ptr0 = passArrayF64ToWasm0(aabb_data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.staticaabb2dindex_new(ptr0, len0, node_size);
        return StaticAABB2DIndex.__wrap(ret);
    }
    /**
    * @param {number} min_x
    * @param {number} min_y
    * @param {number} max_x
    * @param {number} max_y
    * @returns {Uint32Array}
    */
    query(min_x, min_y, max_x, max_y)
    {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.staticaabb2dindex_query(retptr, this.ptr, min_x, min_y, max_x, max_y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint32Array}
    */
    levelBounds()
    {
        var ret = wasm.staticaabb2dindex_levelBounds(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Float64Array}
    */
    allBoxes()
    {
        var ret = wasm.staticaabb2dindex_allBoxes(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} max_results
    * @param {number} max_distance
    * @returns {Uint32Array}
    */
    neighbors(x, y, max_results, max_distance)
    {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.staticaabb2dindex_neighbors(retptr, this.ptr, x, y, max_results, max_distance);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

export const __wbindgen_number_new = function (arg0)
{
    var ret = arg0;
    return addHeapObject(ret);
};

export const __wbindgen_string_new = function (arg0, arg1)
{
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbg_polyline_new = function (arg0)
{
    var ret = Polyline.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_object_drop_ref = function (arg0)
{
    takeObject(arg0);
};

export const __wbg_alert_d6bb738915c282ac = function (arg0, arg1)
{
    alert(getStringFromWasm0(arg0, arg1));
};

export const __wbg_log_5e80869250f2c311 = function (arg0, arg1)
{
    console.log(getStringFromWasm0(arg0, arg1));
};

export const __wbg_new_59cb74e423758ede = function ()
{
    var ret = new Error();
    return addHeapObject(ret);
};

export const __wbg_stack_558ba5917b466edd = function (arg0, arg1)
{
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_error_4bb6c2a97407129a = function (arg0, arg1)
{
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

export const __wbg_new_8528c110a833413f = function ()
{
    var ret = new Array();
    return addHeapObject(ret);
};

export const __wbg_push_17a514d8ab666103 = function (arg0, arg1)
{
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export const __wbg_new_d14bf16e62c6b3d5 = function ()
{
    var ret = new Object();
    return addHeapObject(ret);
};

export const __wbg_newwithlength_657cd32d6434e810 = function (arg0)
{
    var ret = new Uint32Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_setindex_4ff06c39074495a5 = function (arg0, arg1, arg2)
{
    getObject(arg0)[arg1 >>> 0] = arg2 >>> 0;
};

export const __wbg_newwithlength_e02e34b5c96ac015 = function (arg0)
{
    var ret = new Float64Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_setindex_39fb81a38486d25d = function (arg0, arg1, arg2)
{
    getObject(arg0)[arg1 >>> 0] = arg2;
};

export const __wbg_set_61642586f7156f4a = handleError(function (arg0, arg1, arg2)
{
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
});

export const __wbindgen_debug_string = function (arg0, arg1)
{
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_throw = function (arg0, arg1)
{
    throw new Error(getStringFromWasm0(arg0, arg1));
};
