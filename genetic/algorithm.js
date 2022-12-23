const node = require('./tree').node;
const Tree = require('./tree').Tree;

const operations = ["x","+","-","/","number","X","Y","Z"];

function evolutionaryAlgorithm(total, n, iters) {
	console.log("> generating initial population");
	let population = generatePopulation(total, n);
	let fitness = evaluate(population);
}

function generatePopulation(total, n) {

}

function createTree() {
    const node1 = new node(12);
    const node2 = new node(25);
    node1.setLeft(node2);
    console.log(">> node1 data:", node1.data);
    console.log(">> node1 left:", node1.getLeft().data);
}

createTree()