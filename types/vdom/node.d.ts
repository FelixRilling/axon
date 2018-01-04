import { IAxonNode, IAxonNodeRoot, IAxonDirective } from "../interfaces";
declare const getNodeRoot: (node: IAxonNode | IAxonNodeRoot) => IAxonNodeRoot;
declare const AxonNode: {
    new ($element: HTMLElement, $parent: IAxonNode, data?: object): {
        $parent: IAxonNode;
        $element: HTMLElement;
        $children: IAxonNode[];
        directives: IAxonDirective[];
        data: object;
        run(type: string): boolean;
        init(): boolean;
        render(): boolean;
    };
};
export { AxonNode, getNodeRoot };