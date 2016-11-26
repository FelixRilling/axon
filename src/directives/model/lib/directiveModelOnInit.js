"use strict";

import queryDirective from "../../../dom/query/queryDirective";
import getDirectiveValue from "../../../dom/lib/getDirectiveValue";
import bindEvent from "../../../dom/event/bindEvent";
import apply from "../../../rendering/apply";
import render from "../../../rendering/render";

const directiveModelOnInit = function(node, ctrl, directiveContent) {
    const modelType = typeof node.value !== "undefined" ? "value" : "innerText";
    const eventFn = function(ev) {
        apply(ctrl);
    };

    render(ctrl);

    //Bin dependent on nodetype
    bindEvent(node, "change", eventFn);
    bindEvent(node, "keydown", eventFn);

    return {
        modelType,
        modelFor: directiveContent
    };
};

export default directiveModelOnInit;
