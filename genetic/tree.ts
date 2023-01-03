export class node<T> {
    public data:T;
    private _father: node<T> | undefined;
    private _left: node<T> | undefined;
    private _right: node<T>  | undefined;

    constructor( data:T, father?: node<T>, left?: node<T>, right?: node<T>) {
        this.data = data;
        this._father = father ?? undefined;
        this._left = left ?? undefined;
        this._right = right ?? undefined;
    }

    get Father() {
        return this._father;
    }

    get Left() {       
        return this._left;
    }

    get Right() {       
        return this._right;
    }

    set Father(father:node<T>) {
        this._father = father;
    }

    set Left(left:node<T>) {
        this._left = left;
    }

    set Right(right:node<T>) {
        this._right = right;
    }
}

export class Tree<T> {
    public _root: node<T>;

    constructor(root:node<T>) {
        this._root = root;
    }

    get Root() {
        return this._root;
    }

    getLeaves(root?:node<T>) {
        root = root ?? this._root;
        if ( root.Left && root.Right ) {
            const left_side = this.getLeaves(root.Left);
            const rigth_side = this.getLeaves(root.Right);
            return [left_side,rigth_side];
        }
        return [root];
    }

    getHeight(root?:node<T>, count?:number) {
        root = root ?? this._root;
        count = count ?? 0;
        if ( root.Left && root.Right ) {
            count += 1;
            const left_side = this.getHeight(root.Left, count);
            const rigth_side = this.getHeight(root.Right, count);
            const max = Math.max(left_side,rigth_side);
            return max;
        }
        return count;
    }

    dataToArray(root?:node<T>, completeInfo?: boolean) {
        root = root ?? this._root;
        completeInfo = completeInfo ?? false;
        const dataTree = [], completeTree = [];
        const tree = [root];
        const next = [root];
        while(next.length != 0) {
            let index = 0;
            next.forEach(element => {
                if (element.Left) {
                    index = tree.indexOf(element);
                    tree.splice(index,0,element.Left);
                    next.push(element.Left);
                }
                if (element.Right) {
                    index = tree.indexOf(element);
                    tree.splice(index+1,0,element.Right);  
                    next.push(element.Right); 
                }
                index = next.indexOf(element);
                next.splice(index,1);
            });
        }
        tree.forEach(element => {
            dataTree.push(element.data);
            completeTree.push(element);
        });
        if (completeInfo) return completeTree;
        return dataTree;
    }

    nodeDepth(node:node<T>) {
        let count = 0;
        while(node.Father) {
            count +=1;
            node = node.Father;
        }
        return count;
    }

    getCount(root:node<T>) {
        root = root ?? this._root;
        let count = 0, nodes = [];
        nodes = this.dataToArray(root);
        count = nodes.length;
        return count;
    }
}
