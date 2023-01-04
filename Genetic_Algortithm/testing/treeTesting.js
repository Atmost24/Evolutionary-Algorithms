//-----------------------------------------------

function createTree() {
    const node1 = new node("x");
    const tree = new Tree(node1);
    const node2 = new node("X");
    const node3 = new node("+");
    const node4 = new node("X");
    const node5 = new node("Y");
    node1.Left = node2;
    node1.Right = node3;
    node2.Father = node1;
    node3.Father = node1;
    node3.Left = node4;
    node3.Right = node5;
    node4.Father = node3;
    node5.Father = node3;
    // c(">> tree:", tree);
    const leaves = tree.getLeaves();
    // c(">> children:", leaves);
    // c(">> children:", leaves.flat());
    c(">> depth of node 4:", tree.nodeDepth(node3));
    c(">> height:", tree.getHeight());
    // c(">> dataToArray:", dataToArray(node1));
    c(">> tree data to array:", tree.dataToArray());
    // c(">> tree data to array full:", tree.dataToArray(node1,true));
    let nodes = tree.dataToArray(tree.Root,true);
    nodes[2].data = "omg";
    c(">> tree data to array:", tree.dataToArray());
    // c(">> tree data to array full:", tree.dataToArray(node1,true));
    c(">> nodes total:", tree.getCount());

    // console.log(">> node1 left:", node1.Left);
}

// createTree()