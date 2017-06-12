"use strict";

const REGEX_IS_FUNCTION = /\(.*\)/;
const REGEX_CONTENT_METHOD = /([\w\.]+)\s*\(((?:[^()]+)*)?\s*\)\s*/;

import {
    isDefined
} from "../util";

const getNodeRoot = function (node) {
    let result = node;

    while (result._parent !== null) {
        result = result._parent;
    }

    return result;
};

const findPath = function (obj, path) {
    const arr = path.split(".");
    let last = obj;
    let current;
    let index = 0;

    while (index < arr.length) {
        const currentPath = arr[index];

        current = last[currentPath];

        if (isDefined(current)) {
            if (index < arr.length - 1) {
                last = current;
            } else {
                return {
                    val: current,
                    set: val => last[currentPath] = val
                };
            }
        }

        index++;
    }

    return false;
};

const applyMethodContext = methodProp => methodProp.val.apply(methodProp.node.data, methodProp.args);

/**
 * Redirects to fitting retriever and returns
 * @param {String} name
 * @param {Axon} node
 * @returns {Mixed}
 */
const retrieveExpression = function (name, node) {
    if (REGEX_IS_FUNCTION.test(name)) {
        //Call method with context set to rootnode data
        return applyMethodContext(retrieveMethod(name, node));
    } else {
        return retrieveProp(name, node);
    }
};

/**
 * Retrieves a prop from the data container
 * @param {String} expression
 * @param {AxonNode} node
 * @returns {Mixed|false}
 */
const retrieveProp = function (expression, node) {
    let current = node;

    while (current._parent !== false) {
        const data = findPath(current.data, expression);

        if (data !== false) {
            data.node = current;

            return data;
        } else {
            current = current._parent;
        }
    }

    return false;
};

//@TODO
const retrieveMethod = function (expression, node) {
    const matched = expression.match(REGEX_CONTENT_METHOD);
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];
    const _root = getNodeRoot(node);
    const data = findPath(_root.methods, matched[1]);

    if (data !== false) {
        data.args = args;
        data.node = _root;

        return data;
    } else {
        return false;
    }
};

export {
    applyMethodContext,
    retrieveExpression,
    retrieveMethod,
    retrieveProp
};