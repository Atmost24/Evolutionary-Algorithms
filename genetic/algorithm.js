const node = require('./tree').node;
const Tree = require('./tree').Tree;
const operator = require('./operators').module;
const points = require('./data/points.json');

const c = console.log
const operations = ["x","+","-","X","Y"];
const constans = ["X","Y"]

function evolutionaryAlgorithm(total, n, iters) {
	console.log("> generating initial population");
	let population = generatePopulation(total, n);
    let fitness = evaluate(population);
}

function generatePopulation(total, n) {
    let pop = [];
    for (let i = 0; i < total; i++) {
        const root = new node(generateSimbols(operations.length));
        const genotype = new Tree(root);
        generateNodeChildren(genotype,operations.length,n)
        pop.push(genotype);
	}
    return pop;
}

function evaluate(population) {
	let result = [];
	for (let genotype of population) {
		let phenotype = grow(genotype);
        result.push(r2(phenotype));
	}
	return result;
}

function grow(genotype) {
    let phenotype = genotype.dataToArray();
    console.log(">> phenotype:", phenotype);
    return phenotype;
}

function r2(phenotype) {
    let f = 0;
    const numeric = [];
    let X,Y; 
    for (element of phenotype) {
        if ( element == "X" ) {
            element = points[0].x
        } 
        else if ( element == "Y") {
            element = points[0].y
        }
        numeric.push(element);
    }
    c(">> numeric phenotype:", numeric);
    let result = 0;
    // for ([index,element] of numeric) {
    //     if ( element == "x" ) {
    //         result = numeric[index-1]*numeric[index+1]
    //     } 
    //     else if ( element == "Y") {
    //         element = points[0].y
    //     }
    // }   
}


function generateSimbols(max) {
    const random = operator.getRandomInt(max);
    return operations[random];
}

function generateConstant(max) {
    const random = operator.getRandomInt(max);
    return constans[random];
}

function generateNodeChildren(tree, numOfOperations,n) {
    const maxHeight = n
    while (tree.getHeight() < maxHeight ) {
        const children = tree.getLeaves().flat(10);
        const simbols = [generateSimbols(numOfOperations),generateSimbols(numOfOperations)];
        let non_operable = 0;
        children.forEach(child => {
            if (!constans.includes(child.data)) {
                let node1,node2;
                if (tree.nodeDepth(child) == maxHeight - 1){
                    const constan = [generateConstant(constans.length),generateConstant(constans.length)];
                    node1 = new node(constan[0]);
                    node2 = new node(constan[1]);
                }
                else {
                    node1 = new node(simbols[0]);
                    node2 = new node(simbols[1]);
                }
                child.Left = node1;
                node1.Father = child;
                child.Right = node2;
                node2.Father = child;
            } else 
            non_operable += 1;
        });
        if ( non_operable == children.length) {
            break
        }
    }
    
}

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
    c(">> dataToArray:", dataToArray(node1));
    // c(">> dataToArray:", tree.dataToArray());

    // console.log(">> node1 left:", node1.Left);
}

function dataToArray(root) {
    root = root;
        const dataTree = [];
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
                // tree.push(new node("nonce"));
                // tree.unshift(new node("nonce"));
            });
        }
        tree.forEach(element => {
            if (element.data != "nonce" && element.data != undefined) {
                dataTree.push(element.data);
            } 
        });
        return dataTree;
}

// createTree()

evolutionaryAlgorithm(10,4,1);