export abstract class EquationNode {
    public children: EquationNode[];
    public deepness: number = 0;

    constructor(children: EquationNode[]) {
        this.children = children;
    }

    public abstract apply(values: any): number;
    public abstract toString(): string;
    public abstract clone(): EquationNode;
}

export enum BinaryOperator {
    SUM = "+", REST = "-", PRODUCT = "*"
}

export class BinaryOperatorNode extends EquationNode {
    public operator: BinaryOperator;

    constructor(operator: BinaryOperator, left: EquationNode, right: EquationNode) {
        super([left, right]);
        this.operator = operator;
    }

    public apply(values: any): number {
        if (this.operator === BinaryOperator.SUM)
            return this.children[0].apply(values) + this.children[1].apply(values);
        else if (this.operator === BinaryOperator.REST)
            return this.children[0].apply(values) - this.children[1].apply(values);
        return this.children[0].apply(values) * this.children[1].apply(values);
    }

    public toString(): string {
        return "(" + this.children[0].toString() + " " + this.operator + " " + this.children[1].toString() + ")";
    }

    public clone(): EquationNode {
        let node = new BinaryOperatorNode(this.operator, this.children[0].clone(), this.children[1].clone());
        node.deepness = this.deepness;
        return node;
    }
}

export class VariableNode extends EquationNode {
    public variable: string;

    constructor(variable: string) {
        super([]);
        this.variable = variable;
    }

    public apply(values: any): number {
        return values[this.variable] ? values[this.variable] : 0;
    }

    public toString(): string {
        return this.variable;
    }

    public clone(): EquationNode {
        let node = new VariableNode(this.variable);
        node.deepness = this.deepness;
        return node;
    }
}

export class EquationTree {
    public root: EquationNode;

    constructor(root: EquationNode) {
        this.root = root;
    }

    public static generate(maxDeepness: number, deepness: number, opers: BinaryOperator[], variables: string[]): EquationNode {
        let random = Math.random();
        let index = (random < 0.5 && deepness < maxDeepness) ? Math.floor(opers.length * Math.random()) : Math.floor(variables.length * Math.random());
        let node = (random < 0.5 && deepness < maxDeepness) ?
            new BinaryOperatorNode(opers[index], EquationTree.generate(maxDeepness, deepness + 1, opers, variables), EquationTree.generate(maxDeepness, deepness + 1, opers, variables)) :
            new VariableNode(variables[index]);
        node.deepness = deepness;
        return node;
    }

    public apply(values: any): number {
        return this.root.apply(values);
    }

    public toString() {
        return this.root.toString();
    }

    public clone(): EquationTree {
        return new EquationTree(this.root.clone());
    }
}

// async function test() {
//     let opers: BinaryOperator[] = [
//         BinaryOperator.SUM, BinaryOperator.REST, BinaryOperator.PRODUCT
//     ];
//     let variables: string[] = ['X', 'Y'];
//     const MAX_DEEPNESS = 10;
//     let tree = new EquationTree(EquationTree.generate(MAX_DEEPNESS, 1, opers, variables));
//     let sibling = tree.clone();
//     console.log("> tree:", tree.toString());
//     console.log("> value:", tree.apply({ 'X': 0.5, 'Y': 3}));
//     console.log("> sibling:", sibling.toString());
//     console.log("> value:", sibling.apply({ 'X': 0.5, 'Y': 3}));
// }

// test();