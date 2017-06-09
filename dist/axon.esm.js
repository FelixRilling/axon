/**
 * Create a new array with the same contents
 * @param {Array} arr
 * @returns {Array}
 */
const cloneArray = arr => Array.from(arr);

/**
 * Checks if type is array
 * @param {Array} arr
 * @returns {Boolean}
 */
const isArray = arr => Array.isArray(arr);

/**
 * Flatten Array Recursively
 * @param {Array} arr
 * @returns {Array}
 */
const flattenArray = function (arr) {
    const result = [];

    arr.forEach(item => {
        if (isArray(item)) {
            result.push(...flattenArray(item));
        } else {
            result.push(item);
        }
    });

    return result;
};

const isDefined = val => typeof val !== "undefined";

/**
 *
 * @param {String} selector
 * @param {Node} [context=document]
 * @param {Boolean} [context=false]
 * @returns {Node|Array}
 */
const query = function (selector, context = document, all = false) {
    return all ? cloneArray(context.querySelectorAll(selector)) : context.querySelector(selector);
};

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_DELIMITER = ":";
const DOM_ATTR_HIDDEN = "hidden";

const DOM_EVENT_MODEL = "input";

const DOM_PROP_VALUE = "value";
const DOM_PROP_TEXT = "textContent";
const DOM_PROP_HTML = "innerHTML";

/**
 * Checks if an attribute is an axon directive
 * @param {Attribute} attr
 * @returns {Boolean}
 */
const isAttrDirective = attr => attr.name.startsWith(DOM_ATTR_PREFIX);

/**
 * Checks if the element has any directives
 * @param {Element} element
 * @returns {Boolean}
 */
const hasDirectives = element => cloneArray(element.attributes).some(isAttrDirective);

/**
 * Returns directives on node
 * @param {Element} element
 * @returns {Array}
 */
const getDirectives = function (element) {
    const attributes = cloneArray(element.attributes).filter(isAttrDirective);

    return attributes.map(attr => {
        /**
         * 'x-bind:hidden="foo"' => nameFull=["bind","hidden"] val="foo"
         */
        const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);
        const val = attr.value;

        return {
            val,
            name: nameFull[0],
            secondary: nameFull[1] || false,
        };
    });
};

const directiveIgnoreBoth = () => false;

const findPropInNode = function (path, obj) {
    let entry = obj;
    let current;
    let index = 0;

    while (index < path.length) {
        const propPath = path[index];

        current = entry[propPath];

        if (isDefined(current)) {
            if (index < path.length - 1) {
                entry = current;
            } else {
                return {
                    val: current,
                    set: val => entry[propPath] = val
                };
            }
        }

        index++;
    }

    return false;
};

//@TODO
const retrieveProp = function (expression, node) {
    const path = expression.split(".");
    const data = findPropInNode(path, node._root.methods);

    if (data !== false) {
        console.log(data);

        return data;
    } else {
        return false;
    }
};

/**
 * Retrieves a prop from the data container
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed|false}
 */
const retrieveProp$1 = function (expression, node) {
    const path = expression.split(".");
    let endReached = false;
    let current = node;

    console.log([node,path]);

    while (!endReached) {
        const data = findPropInNode(path, current.data);

        if (data !== false) {
            data.node = current;

            return data;
        } else {
            if (current._parent !== false) {
                current = current._parent;
            } else {
                endReached = true;
            }
        }
    }

    return false;
};

const REGEX_FUNCTION = /\(.*\)/;

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @returns {Mixed}
 */
const evaluateExpression = (name, node) => REGEX_FUNCTION.test(name) ? retrieveProp(name, node) : retrieveProp$1(name, node);

const directiveIfRender = function (directive, node) {
    const element = node._element;
    const expressionValue = evaluateExpression(directive.val, node);
    const result = Boolean(expressionValue);

    if (result) {
        element.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        element.setAttribute(DOM_ATTR_HIDDEN, true);
    }

    return result;
};

/*import bindEvent from "../../dom/bindEvent";
import retrieveMethod from "../../controller/retrieveMethod";*/

const directiveOnInit = function (node, directive, instanceContent) {
    /*const targetMethod = retrieveMethod(instanceContent.$methods, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instanceContent);

    return true;*/
    return true;
};

//@TODO

//import getNodeValueType from "./getNodeValueType";

const bindEvent = function (node, eventType, eventFn) {
    return node.addEventListener(eventType, eventFn, false);
};

const getNodeContentProp = function (node) {
    if (isDefined(node[DOM_PROP_VALUE])) {
        return DOM_PROP_VALUE;
    } else if (isDefined(node[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    } else {
        return DOM_PROP_HTML;
    }
};

const directiveModelInit = function (directive, node) {
    const propName = directive.val;
    const element = node._element;
    const elementContentProp = getNodeContentProp(element);

    const eventFn = function () {
        const targetProp = retrieveProp$1(propName, node);
        const newVal = element[elementContentProp];

        //Update and render data node
        targetProp.set(newVal);
        targetProp
            .node
            .render();
    };

    bindEvent(node._element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const propName = directive.val;
    const element = node._element;
    const elementContentProp = getNodeContentProp(element);
    const targetProp = retrieveProp$1(propName, node);

    element[elementContentProp] = targetProp.val;

    return true;
};

//import evaluateExpression from "../../controller/evaluateExpression";

const directiveBindRender = function (node, directive,instanceContent) {
    /*const propValue = evaluateExpression(instanceContent, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;*/
    return true;
};

const directives = {
    "ignore": {
        init: directiveIgnoreBoth,
        render: directiveIgnoreBoth
    },
    "if": {
        render: directiveIfRender
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
    }
};

/**
 * Axon Node
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     * @param {Element} element
     * @param {Element} _parent
     * @param {Element|true} _root
     */
    constructor(element, _parent, _root) {
        const node = this;
        const recurseSubNodes = function (child) {
            if (hasDirectives(child)) {
                //-> Recurse
                return new AxonNode(child, node, _root);
            } else if (child.children.length > 0) {
                //-> Enter Children
                return getSubNodes(child.children);
            } else {
                //-> Exit dead-end
                return null;
            }
        };
        const getSubNodes = children => flattenArray(cloneArray(children).map(recurseSubNodes).filter(val => val !== null));

        this.data = {}; //@TODO attach proxy

        this.directives = getDirectives(element);

        this._element = element;
        this._parent = _parent;
        this._root = _root; //is either a reference to the root or true if the node is the root
        this._children = getSubNodes(element.children); //Flatten Array as we only care about the relative position
    }
    /**
     * Runs directive over node, returns false when this node shouldnt be recursed
     * @param {"init"|"render"} type
     * @returns {Boolean}
     */
    execDirectives(type) {
        return this
            .directives
            .map(directive => {
                const directivesDictEntry = directives[directive.name];

                if (!directivesDictEntry) {
                    console.log(`directive '${directive.name}' not found`);
                    return true;
                } else {
                    if (!directivesDictEntry[type]) {
                        console.log(`directive has no type '${type}'`);
                        return true;
                    } else {
                        return directivesDictEntry[type](directive, this);
                    }
                }
            })
            .every(val => val !== false);
    }
    /**
     * Runs execDirectives against the node and all subnodes
     * @param {"init"|"render"} type
     */
    execDirectivesRecursive(type) {
        const result = this.execDirectives(type);

        if (result) {
            this
                ._children
                .forEach(child => {
                    child.execDirectives(type);
                });
        }

        return result;
    }
    /**
     * Initializes directives
     */
    init() {
        return this.execDirectivesRecursive("init");
    }
    /**
     * Renders directives
     */
    render() {
        return this.execDirectivesRecursive("render");
    }
};

/**
 * Axon Root Node
 * @class
 */
const AxonNodeRoot = class extends AxonNode {
    /**
     * Basic Axon Constructor
     * @constructor
     * @param {Object} cfg Config data for the Axon instance
     */
    constructor(cfg) {
        const element = query(cfg.el);

        super(element, false, true);

        this.data = cfg.data || {};
        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export default AxonNodeRoot;
