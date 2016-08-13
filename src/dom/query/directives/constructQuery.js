"use strict";

import {
    _domNameSpace
} from "../../../constants";

/**
 * Creates querySelector string
 *
 * @private
 * @param {String} data The data id
 * @param {String} val The data value
 * @return {String} Returns Query
 */
export default function(data, val) {
    if (!val || val === "*") {
        return `[${_domNameSpace}-${data}]`;
    } else {
        return `[${_domNameSpace}-${data}='${val}']`;
    }
}