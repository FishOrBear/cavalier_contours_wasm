
export function initWasm(): Promise<void>;

/**
*/
export function greet(): void;
/**
*/
export function init(): void;
/**
*/
export class Polyline {
    free(): void;
    /**
    * @param {Float64Array} vertex_data
    * @param {boolean} is_closed
    */
    constructor(vertex_data: Float64Array, is_closed: boolean);
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} bulge
    */
    add(x: number, y: number, bulge: number): void;
    /**
    */
    clear(): void;
    /**
    * @param {number} count
    */
    cycleVertexes(count: number): void;
    /**
    * @returns {Float64Array}
    */
    vertexData(): Float64Array;
    /**
    * @returns {number}
    */
    area(): number;
    /**
    * @returns {number}
    */
    pathLength(): number;
    /**
    * @param {number} scale_factor
    */
    scale(scale_factor: number): void;
    /**
    * @param {number} x_offset
    * @param {number} y_offset
    */
    translate(x_offset: number, y_offset: number): void;
    /**
    * @param {number} x
    * @param {number} y
    * @returns {number}
    */
    windingNumber(x: number, y: number): number;
    /**
    * @param {Polyline} other
    * @param {number} operation
    */
    boolean(other: Polyline, operation: number): Polyline[];
    /**
    * @param {number} x
    * @param {number} y
    * @returns {any}
    */
    closestPoint(x: number, y: number): any;
    /**
    * @returns {StaticAABB2DIndex}
    */
    createApproxSpatialIndex(): StaticAABB2DIndex;
    /**
    * @returns {StaticAABB2DIndex}
    */
    createSpatialIndex(): StaticAABB2DIndex;
    /**
    * @returns {Float64Array}
    */
    extents(): Float64Array;
    /**
    */
    invertDirection(): void;
    /**
    * @param {number} offset
    * @param {boolean} handle_self_intersects
    * @returns {Array<any>}
    */
    parallelOffset(offset: number, handle_self_intersects: boolean): Array<Polyline>;
    /**
    * @param {number} offset
    * @returns {Polyline}
    */
    rawOffset(offset: number): Polyline;
    /**
    * @param {number} offset
    * @returns {Array<any>}
    */
    rawOffsetSegs(offset: number): Array<any>;
    /**
    * @returns {Array<any>}
    */
    selfIntersects(): Array<any>;
    /**
    * @param {number} error_distance
    * @returns {Polyline}
    */
    arcsToApproxLines(error_distance: number): Polyline;
    /**
    * @param {number} error_distance
    * @returns {Float64Array}
    */
    arcsToApproxLinesData(error_distance: number): Float64Array;
    /**
    * @returns {any}
    */
    testProperties(): any;
    /**
    */
    logToConsole(): void;
    /**
    * @returns {boolean}
    */
    isClosed: boolean;
    /**
    * @returns {number}
    */
    readonly length: number;
}
/**
*/
export class StaticAABB2DIndex {
    free(): void;
    /**
    * @param {Float64Array} aabb_data
    * @param {number} node_size
    */
    constructor(aabb_data: Float64Array, node_size: number);
    /**
    * @param {number} min_x
    * @param {number} min_y
    * @param {number} max_x
    * @param {number} max_y
    * @returns {Uint32Array}
    */
    query(min_x: number, min_y: number, max_x: number, max_y: number): Uint32Array;
    /**
    * @returns {Uint32Array}
    */
    levelBounds(): Uint32Array;
    /**
    * @returns {Float64Array}
    */
    allBoxes(): Float64Array;
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} max_results
    * @param {number} max_distance
    * @returns {Uint32Array}
    */
    neighbors(x: number, y: number, max_results: number, max_distance: number): Uint32Array;
}
