"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.node = void 0;
var node = /** @class */ (function () {
    function node(data, father, left, right) {
        this.data = data;
        this._father = father !== null && father !== void 0 ? father : undefined;
        this._left = left !== null && left !== void 0 ? left : undefined;
        this._right = right !== null && right !== void 0 ? right : undefined;
    }
    Object.defineProperty(node.prototype, "Father", {
        get: function () {
            return this._father;
        },
        set: function (father) {
            this._father = father;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(node.prototype, "Left", {
        get: function () {
            return this._left;
        },
        set: function (left) {
            this._left = left;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(node.prototype, "Right", {
        get: function () {
            return this._right;
        },
        set: function (right) {
            this._right = right;
        },
        enumerable: false,
        configurable: true
    });
    return node;
}());
exports.node = node;
var Tree = /** @class */ (function () {
    function Tree(root) {
        this._root = root;
    }
    Object.defineProperty(Tree.prototype, "Root", {
        get: function () {
            return this._root;
        },
        enumerable: false,
        configurable: true
    });
    Tree.prototype.getLeaves = function (root) {
        root = root !== null && root !== void 0 ? root : this._root;
        if (root.Left && root.Right) {
            var left_side = this.getLeaves(root.Left);
            var rigth_side = this.getLeaves(root.Right);
            return [left_side, rigth_side];
        }
        return [root];
    };
    Tree.prototype.getHeight = function (root, count) {
        root = root !== null && root !== void 0 ? root : this._root;
        count = count !== null && count !== void 0 ? count : 0;
        if (root.Left && root.Right) {
            count += 1;
            var left_side = this.getHeight(root.Left, count);
            var rigth_side = this.getHeight(root.Right, count);
            var max = Math.max(left_side, rigth_side);
            return max;
        }
        return count;
    };
    Tree.prototype.dataToArray = function (root, completeInfo) {
        root = root !== null && root !== void 0 ? root : this._root;
        completeInfo = completeInfo !== null && completeInfo !== void 0 ? completeInfo : false;
        var dataTree = [], completeTree = [];
        var tree = [root];
        var next = [root];
        var _loop_1 = function () {
            var index = 0;
            next.forEach(function (element) {
                if (element.Left) {
                    index = tree.indexOf(element);
                    tree.splice(index, 0, element.Left);
                    next.push(element.Left);
                }
                if (element.Right) {
                    index = tree.indexOf(element);
                    tree.splice(index + 1, 0, element.Right);
                    next.push(element.Right);
                }
                index = next.indexOf(element);
                next.splice(index, 1);
            });
        };
        while (next.length != 0) {
            _loop_1();
        }
        tree.forEach(function (element) {
            dataTree.push(element.data);
            completeTree.push(element);
        });
        if (completeInfo)
            return completeTree;
        return dataTree;
    };
    Tree.prototype.nodeDepth = function (node) {
        var count = 0;
        while (node.Father) {
            count += 1;
            node = node.Father;
        }
        return count;
    };
    Tree.prototype.getCount = function (root) {
        root = root !== null && root !== void 0 ? root : this._root;
        var count = 0, nodes = [];
        nodes = this.dataToArray(root);
        count = nodes.length;
        return count;
    };
    return Tree;
}());
exports.Tree = Tree;
