var Axon = (function () {
'use strict';

/**
 * Checks if the value has a certain type-string.
 *
 * @function isTypeOf
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @param {string} type
 * @returns {boolean}
 * @example
 * // returns true
 * isTypeOf({}, "object")
 * isTypeOf([], "object")
 * isTypeOf("foo", "string")
 *
 * @example
 * // returns false
 * isTypeOf("foo", "number")
 */
const isTypeOf = (val, type) => typeof val === type;

/**
 * Checks if a value is an array.
 *
 * `Array.isArray` shorthand.
 *
 * @function isArray
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isArray([]);
 * isArray([1, 2, 3]);
 *
 * @example
 * // returns false
 * isArray({});
 */
const isArray = Array.isArray;

/**
 * Checks if a value is undefined.
 *
 * @function isUndefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(a.b)
 * isUndefined(undefined)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(1)
 * isUndefined(a)
 */
const isUndefined = (val) => isTypeOf(val, "undefined");

/**
 * Checks if a value is defined.
 *
 * @function isDefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * const a = {};
 *
 * isDefined(1)
 * isDefined(a)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isDefined(a.b)
 * isDefined(undefined)
 */
const isDefined = (val) => !isUndefined(val);

/**
 * Checks if a value is undefined or null.
 *
 * @function isNil
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isNil(null)
 * isNil(undefined)
 *
 * @example
 * // returns false
 * isNil(0)
 * isNil({})
 */
const isNil = (val) => isUndefined(val) || val === null;

/**
 * Returns an array of the objects entries.
 *
 * `Object.entries` shorthand.
 *
 * @function objEntries
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {any[]} Array<[key: any, val: any]>]
 * @example
 * // returns [["a", 1], ["b", 2], ["c", 3]]
 * objEntries({a: 1, b: 2, c: 3})
 */
const objEntries = Object.entries;

/**
 * Iterates over each element in an array
 *
 * Wrapper around arr.forEach to have a cleaner API and better minified code
 *
 * @function forEach
 * @memberof For
 * @param {any[]} arr
 * @param {function} fn fn(val: any, index: number, arr: any[])
 * @example
 * // returns a = [0, 2, 6]
 * const a = [1, 2, 3];
 *
 * forEach(a, (val, index)=>a[index] = val * index)
 */
const forEach = (arr, fn) => arr.forEach(fn);

/**
 * Iterates over each entry of an object
 *
 * @function forEachEntry
 * @memberof For
 * @param {object} obj
 * @param {function} fn fn(val: any, key: any, index: number, arr: any[])
 * @example
 * // returns a = {a: 0, b: 2}
 * const a = {a: 1, b: 2};
 *
 * forEachEntry(a, (val, key, index) => a[key] = val * index)
 */
const forEachEntry = (obj, fn) => {
    forEach(objEntries(obj), (entry, index) => {
        fn(entry[1], entry[0], index, obj);
    });
};

/**
 * Checks if a value is an object.
 *
 * @function isObject
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isObject({})
 * isObject([])
 * isObject(() => 1))
 *
 * @example
 * // returns false
 * isObject(1)
 */
const isObject = (val) => !isNil(val) && (isTypeOf(val, "object") || isTypeOf(val, "function"));

/**
 * Recursively flattens an array.
 *
 * @function arrFlattenDeep
 * @memberof Array
 * @since 1.0.0
 * @param {any[]} arr
 * @returns {any[]}
 * @example
 * // returns [1, 2, 3]
 * arrFlattenDeep([1, 2, [3]])
 *
 * @example
 * // returns [1, 2, 3, 5, 6, 6]
 * arrFlattenDeep([1, 2, [3, [[[5]]], [6, [6]]])
 */
const arrFlattenDeep = (arr) => {
    const result = [];
    forEach(arr, (val) => {
        if (isArray(val)) {
            result.push(...arrFlattenDeep(val));
        }
        else {
            result.push(val);
        }
    });
    return result;
};

/**
 * Creates a new array with the values of the input iterable.
 *
 * `Array.from` shorthand.
 *
 * @function arrFrom
 * @memberof Array
 * @since 1.0.0
 * @param {any} arr
 * @returns {any[]}
 * @example
 * // returns a = [1, 2, 3], b = [1, 10, 3]
 * const a = [1, 2, 3];
 * const b = arrFrom(a);
 *
 * b[1] = 10;
 */
const arrFrom = Array.from;

/**
 * Creates a new object with the entries of the input object.
 *
 * @function objFrom
 * @memberof Object
 * @since 1.0.0
 * @param {object} obj
 * @returns {object}
 * @example
 * // returns a = {a: 4, b: 2}, b = {a: 10, b: 2}
 * const a = {a: 4, b: 2};
 * const b = objFrom(a);
 *
 * b.a = 10;
 */
const objFrom = (obj) => isArray(obj) ? arrFrom(obj) : Object.assign({}, obj);

/**
 * Creates a map from an object.
 *
 * @function mapFromObject
 * @memberof Map
 * @since 1.0.0
 * @param {Object} obj
 * @returns {Map}
 * @example
 * // returns Map{a: 1, b: 4, c: 5}
 * mapFromObject({a: 1, b: 4, c: 5})
 */
const mapFromObject = (obj) => new Map(objEntries(obj));

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";
const DOM_ATTR_HIDDEN = "hidden";
const DOM_PROP_VALUE = "value";
const DOM_PROP_TEXT = "textContent";
const DOM_PROP_HTML = "innerHTML";

const setDirective = (element, key, value) => element.setAttribute(DOM_ATTR_PREFIX + key, value);
const hasDirective = (element, key) => element.hasAttribute(DOM_ATTR_PREFIX + key);
const removeDirective = (element, key) => element.removeAttribute(DOM_ATTR_PREFIX + key);
const isDirective = (attr) => attr.name.startsWith(DOM_ATTR_PREFIX);
const getDirectives = (element) => arrFrom(element.attributes).filter(isDirective);
const hasDirectives = (element) => getDirectives(element).length > 0;
const parseDirectives = (element) => getDirectives(element)
    .map((attr) => {
    const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);
    return {
        name: nameFull[0],
        opt: nameFull[1] || "",
        content: attr.value,
    };
});

const dataProxyFactory = (node) => {
    return {
        set: (target, key, val) => {
            if (val !== target[key]) {
                target[key] = val;
                node.render();
            }
            return true;
        }
    };
};
const mapProxy = (obj, proxyObj) => {
    const result = obj;
    forEachEntry(result, (val, key) => {
        if (isObject(val)) {
            result[key] = mapProxy(val, proxyObj);
        }
    });
    return new Proxy(obj, proxyObj);
};
const bindDeepDataProxy = (obj, node) => mapProxy(obj, dataProxyFactory(node));

const bindEvent = (element, eventType, eventFn) => element.addEventListener(eventType, eventFn);

/**
 * Regex for comparisons
 *
 * @private
 * @memberof EvalRegex
 */
/**
 * Checks if the value has a certain type-string.
 *
 * @function isTypeOf
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @param {string} type
 * @returns {boolean}
 * @example
 * // returns true
 * isTypeOf({}, "object")
 * isTypeOf([], "object")
 * isTypeOf("foo", "string")
 *
 * @example
 * // returns false
 * isTypeOf("foo", "number")
 */
const isTypeOf$1 = (val, type) => typeof val === type;

/**
 * Checks if a value is undefined.
 *
 * @function isUndefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(a.b)
 * isUndefined(undefined)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isUndefined(1)
 * isUndefined(a)
 */
const isUndefined$1 = (val) => isTypeOf$1(val, "undefined");

/**
 * Checks if a value is defined.
 *
 * @function isDefined
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * const a = {};
 *
 * isDefined(1)
 * isDefined(a)
 *
 * @example
 * // returns false
 * const a = {};
 *
 * isDefined(a.b)
 * isDefined(undefined)
 */
const isDefined$1 = (val) => !isUndefined$1(val);

/**
 * Checks if a target has a certain key.
 *
 * @function hasKey
 * @memberof Has
 * @since 1.0.0
 * @param {any} target
 * @param {string} key
 * @returns {boolean}
 * @example
 * // returns true
 * hasKey([1, 2, 3], "0")
 * hasKey({foo: 0}, "foo")
 * hasKey("foo", "replace")
 *
 * @example
 * // returns false
 * hasKey({}, "foo")
 */
const hasKey$1 = (target, key) => isDefined$1(target[key]);

/**
 * Checks if a value is undefined or null.
 *
 * @function isNil
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @returns {boolean}
 * @example
 * // returns true
 * isNil(null)
 * isNil(undefined)
 *
 * @example
 * // returns false
 * isNil(0)
 * isNil({})
 */
const isNil$1 = (val) => isUndefined$1(val) || val === null;

/**
 * Returns an array of the objects entries.
 *
 * `Object.entries` shorthand.
 *
 * @function objEntries
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {any[]} Array<[key: any, val: any]>]
 * @example
 * // returns [["a", 1], ["b", 2], ["c", 3]]
 * objEntries({a: 1, b: 2, c: 3})
 */
const objEntries$1 = Object.entries;

/**
 * Creates a map from an object.
 *
 * @function mapFromObject
 * @memberof Map
 * @since 1.0.0
 * @param {Object} obj
 * @returns {Map}
 * @example
 * // returns Map{a: 1, b: 4, c: 5}
 * mapFromObject({a: 1, b: 4, c: 5})
 */
const mapFromObject$1 = (obj) => new Map(objEntries$1(obj));

/**
 * Map for comparison checks
 *
 * @private
 * @memberof EvalMap
 */
const mapComparison = mapFromObject$1({
    "===": (a, b) => a === b,
    "!==": (a, b) => a !== b,
    "&&": (a, b) => a && b,
    "||": (a, b) => a || b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
});

/**
 * Map for math checks.
 *
 * @private
 * @memberof EvalMap
 */
const mapMath = mapFromObject$1({
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
    "**": (a, b) => a ** b,
});

/**
 * Regex checking for string literals
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_IS_STRING_LITERAL = /^["'`].*["'`]$/;

/**
 * Returns a string literal as "normal" string
 *
 * @function getStringLiteral
 * @memberof Get
 * @param {string} str
 * @returns {string}
 */
const getStringLiteral = (str) => str.substr(1, str.length - 2);

/**
 * Regex for splitting paths
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_PATH_SPLIT = /(?:\.|\[|\])+/g;

/**
 * Accesses a target by a path of keys. If the path doesn't exist, null is returned
 *
 * @function getPathFull
 * @memberof Get
 * @param {any} target
 * @param {string} path
 * @param {boolean} [getContaining=false]
 * @returns {any|null}
 */
const getPathFull = (target, path, getContaining = false) => {
    const pathArr = path
        .split(REGEX_PATH_SPLIT)
        .map((item) => REGEX_IS_STRING_LITERAL.test(item) ? getStringLiteral(item) : item);
    let targetCurrent = target;
    let targetLast = null;
    let key = null;
    let index = 0;
    while (!isNil$1(targetCurrent) && index < pathArr.length) {
        key = pathArr[index];
        if (hasKey$1(targetCurrent, key)) {
            targetLast = targetCurrent;
            // @ts-ignore
            targetCurrent = targetCurrent[key];
            index++;
        }
        else {
            return null;
        }
    }
    if (getContaining) {
        return {
            index,
            key,
            val: targetCurrent,
            container: targetLast
        };
    }
    else {
        return targetCurrent;
    }
};

/**
 * Map for literal checks.
 *
 * undefined and NaN are omitted because you usually wont need those
 *
 * @private
 * @memberof EvalMap
 */
const mapLiteral = mapFromObject$1({
    "false": false,
    "true": true,
    "null": null
});

/**
 * Regex for function call args
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_GET_FUNCTION_CALL_ARGS = /(.+)\s?\((.*)\)/;

/**
 * Regex checking for function calls
 *
 * @private
 * @memberof EvalRegex
 */
const REGEX_IS_FUNCTION_CALL = /^.+\(.*\)$/;

const handleMissingProp = (propName, allowUndefined) => {
    if (!allowUndefined) {
        throw new Error(`missing prop/method '${propName}'`);
    }
    else {
        return false;
    }
};
const applyMethodContext = (methodProp, additionalArgs = []) => methodProp.val.apply(methodProp.node.data, [...methodProp.args, ...additionalArgs]);
const evalLiteralFromNode = (expression, node) => {
    let result = null;
    if (!isNaN(Number(expression))) {
        result = Number(expression);
    }
    else if (REGEX_IS_STRING_LITERAL.test(expression)) {
        result = getStringLiteral(expression);
    }
    else if (mapLiteral.has(expression)) {
        result = mapLiteral.get(expression);
    }
    else {
        result = evalProp(expression, node).val;
    }
    return result;
};
const evalDirective = (name, node, allowUndefined = false) => {
    if (REGEX_IS_FUNCTION_CALL.test(name)) {
        const method = evalMethod(name, node, allowUndefined);
        const methodResult = applyMethodContext(method);
        return {
            node: method.node,
            val: methodResult
        };
    }
    else {
        return evalProp(name, node, allowUndefined);
    }
};
const evalProp = (expression, node, allowUndefined = false) => {
    let current = node;
    while (current) {
        const data = getPathFull(current.data, expression, true);
        if (data !== null) {
            data.node = current;
            return data;
        }
        current = current.$parent;
    }
    return handleMissingProp(expression, allowUndefined);
};
const evalMethod = (expression, node, allowUndefined = false) => {
    const matched = expression.match(REGEX_GET_FUNCTION_CALL_ARGS);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const root = getNodeRoot(node);
    const data = getPathFull(root.methods, matched[1], true);
    if (data !== null) {
        data.args = args.map((arg) => evalLiteralFromNode(arg, node));
        data.node = root;
        return data;
    }
    else {
        return handleMissingProp(expression, allowUndefined);
    }
};

const getElementContentProp = (element) => {
    if (isDefined(element[DOM_PROP_VALUE])) {
        return DOM_PROP_VALUE;
    }
    else if (isDefined(element[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    }
    else {
        return DOM_PROP_HTML;
    }
};
const setElementActive = (element, active) => active ?
    element.removeAttribute(DOM_ATTR_HIDDEN) :
    element.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);

const DOM_EVENT_MODEL = "input";
const directiveModelInit = (directive, element, node) => {
    const elementContentProp = getElementContentProp(element);
    bindEvent(element, DOM_EVENT_MODEL, () => {
        const targetProp = evalProp(directive.content, node);
        targetProp.container[targetProp.key] = element[elementContentProp];
    });
    return true;
};
const directiveModelRender = function (directive, element, node) {
    const elementContentProp = getElementContentProp(element);
    const targetProp = evalProp(directive.content, node);
    element[elementContentProp] = targetProp.val;
    return true;
};

const directiveBindRender = (directive, element, node) => {
    element.setAttribute(directive.opt, evalDirective(directive.content, node).val);
    return true;
};

const DOM_DIR_FOR_BASE = "forbase";
const DOM_DIR_FOR_DYNAMIC = "dyn";
const FOR_REGEX_ARR = /(.+) of (.+)/;
const directiveForInit = (directive, element, node) => {
    setDirective(element, DOM_DIR_FOR_BASE, DOM_DIR_FOR_BASE);
    setElementActive(element, false);
    return false;
};
const directiveForRender = (directive, element, node) => {
    const directiveSplit = directive.content.match(FOR_REGEX_ARR);
    const iteratorKey = directiveSplit[1];
    const iterable = evalProp(directiveSplit[2], node).val;
    node.$children = [];
    forEach(arrFrom(element.parentElement.children), (child) => {
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });
    for (const i of iterable) {
        const nodeElement = element.cloneNode(true);
        const nodeData = objFrom(node.data);
        let elementInserted;
        let nodeNew;
        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, DOM_DIR_FOR_DYNAMIC);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);
        nodeData[iteratorKey] = i;
        elementInserted = element.insertAdjacentElement("beforebegin", nodeElement);
        nodeNew = new AxonNode(elementInserted, node.$parent, nodeData);
        node.$children.push(nodeNew);
        nodeNew.init();
    }
    return true;
};

const directiveTextRender = (directive, element, node) => {
    element[DOM_PROP_TEXT] = String(evalDirective(directive.content, node).val);
    return true;
};

const directiveHTMLRender = (directive, element, node) => {
    element[DOM_PROP_HTML] = String(evalDirective(directive.content, node).val);
    return true;
};

const directiveIfBoth = (directive, element, node) => {
    const expressionValue = Boolean(evalDirective(directive.content, node, true).val);
    setElementActive(element, expressionValue);
    return expressionValue;
};

const directiveOnInit = (directive, element, node) => {
    bindEvent(element, directive.opt, (e) => applyMethodContext(evalMethod(directive.content, node), [e]));
    return true;
};

const directives = mapFromObject({
    "if": {
        init: directiveIfBoth,
        render: directiveIfBoth
    },
    "on": {
        init: directiveOnInit,
    },
    "model": {
        init: directiveModelInit,
        render: directiveModelRender
    },
    "bind": {
        render: directiveBindRender
    },
    "text": {
        render: directiveTextRender
    },
    "html": {
        render: directiveHTMLRender
    },
    "for": {
        init: directiveForInit,
        render: directiveForRender
    }
});

const getNodeRoot = (node) => {
    let result = node;
    while (result.$parent !== null) {
        result = result.$parent;
    }
    return result;
};
const mapSubNodes = (children, node) => arrFlattenDeep(arrFrom(children)
    .map((child) => {
    if (hasDirectives(child)) {
        return new AxonNode(child, node);
    }
    else if (child.children.length > 0) {
        return mapSubNodes(child.children, node);
    }
    else {
        return null;
    }
})
    .filter((val) => val !== null));
const AxonNode = class {
    constructor($element, $parent, data = {}) {
        const dataStorage = data;
        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);
        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($element.children, this);
    }
    run(type) {
        const directiveResults = this.directives
            .map((directive) => {
            if (directives.has(directive.name)) {
                const mapDirectivesEntry = directives.get(directive.name);
                if (mapDirectivesEntry[type]) {
                    return mapDirectivesEntry[type](directive, this.$element, this);
                }
            }
            return true;
        });
        if (directiveResults.every((directiveResult) => directiveResult === true)) {
            this.$children.map((child) => child.run(type));
            return true;
        }
        else {
            return false;
        }
    }
    init() {
        return this.run("init");
    }
    render() {
        return this.run("render");
    }
};

const AxonNodeRoot = class extends AxonNode {
    constructor(cfg) {
        super(cfg.el, null, cfg.data);
        this.methods = cfg.methods || {};
        this.init();
        this.render();
    }
};

return AxonNodeRoot;

}());
//# sourceMappingURL=axon.js.map
