"use strict";

import debounce from "../lib/debounce";
import {
    DOM_EVENT_TIMEOUT
} from "../lib/constants";
import getNodeValueType from "./getNodeValueType";

const bindEvent = function (node, eventType, eventFn, eventArgs, instanceData) {
    const debouncedFn = debounce(eventFn, DOM_EVENT_TIMEOUT);
    const nodeValueType = getNodeValueType(node);

    const eventFnWrapper = function (event) {
        const target = event.target;
        const args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instanceData, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

export default bindEvent;