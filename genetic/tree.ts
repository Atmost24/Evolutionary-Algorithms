export class node<T> {
    public data:T;
    private father: node<T> | undefined;
    private left: node<T> | undefined;
    private right: node<T>  | undefined;

    constructor( data:T, father?: node<T>, left?: node<T>, right?: node<T>) {
        this.data = data;
        this.father = father ?? undefined;
        this.left = left ?? undefined;
        this.right = right ?? undefined;
    }

    getFather() {
        return this.father;
    }

    getLeft() {
        return this.left;
    }

    getRight() {
        return this.right;
    }

    setLeft(left:node<T>) {
        this.left = left;
    }

    setRight(right:node<T>) {
        this.right = right;
    }


}

export class Tree<T> {
    public root: node<T>;

    constructor(root:node<T>) {
        this.root = root;
    }
}



// function createTree() {
//     const node1 = new node<number>(12);
//     console.log(">> node1 data:", node1.data);
//     // const tree_ = new Tree<number>()
// }

// createTree()