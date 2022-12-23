"use strict";
exports.__esModule = true;
exports.Tree = exports.node = void 0;
var node = /** @class */ (function () {
    function node(data, father, left, right) {
        this.data = data;
        this.father = father !== null && father !== void 0 ? father : undefined;
        this.left = left !== null && left !== void 0 ? left : undefined;
        this.right = right !== null && right !== void 0 ? right : undefined;
    }
    node.prototype.getFather = function () {
        return this.father;
    };
    node.prototype.getLeft = function () {
        return this.left;
    };
    node.prototype.getRight = function () {
        return this.right;
    };
    node.prototype.setLeft = function (left) {
        this.left = left;
    };
    node.prototype.setRight = function (right) {
        this.right = right;
    };
    return node;
}());
exports.node = node;
var Tree = /** @class */ (function () {
    function Tree(root) {
        this.root = root;
    }
    return Tree;
}());
exports.Tree = Tree;
// function createTree() {
//     const node1 = new node<number>(12);
//     console.log(">> node1 data:", node1.data);
//     // const tree_ = new Tree<number>()
// }
// createTree()
