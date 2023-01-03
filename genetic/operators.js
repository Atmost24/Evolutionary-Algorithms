const node = require('./tree').node;
const operations = ["x","+","-","X","Y"];
const functions = ["x","+","-"];
const constans = ["X","Y"];

let mutation = {
	arity: 1,
	apply: function (parent) {
		let child = parent;
		let count = child.getCount();
		let random = getRandomInt(count);
		let tree = child.dataToArray(child.Root,true);
		let selectedNode = tree[random];
		if (!constans.includes(selectedNode.data)) {
			tree[random].data = generateFunction(functions.length);
		}
		else {
			tree[random].data = generateConstant(constans.length);
		}
		return [child];
	}
}

let crossover = {
	arity: 2,
	apply: function (parent1, parent2) {
		let child1 = parent1, child2 = parent2;
		// console.log(">> parent1:", parent1.dataToArray())
		// console.log(">> parent2:", parent2.dataToArray())
		let count1 = child1.getCount(), count2 = child2.getCount();
		let random1 = getRandomInt(count1), random2 = getRandomInt(count2);
		let tree1 = child1.dataToArray(child1.Root,true), tree2 = child2.dataToArray(child2.Root,true);
		let node1 = new node(tree1[random1].data);
		node1.Left = tree1[random1].Left;
		node1.Right = tree1[random1].Right;
		tree1[random1].data =  tree2[random2].data;
		tree1[random1].Left =  tree2[random2].Left;
		tree1[random1].Right =  tree2[random2].Right;
		
		// tree1[random1] = tree2[random2];
		tree2[random2].data = node1.data;
		tree2[random2].Left = node1.Left;
		tree2[random2].Right = node1.Right;
		// console.log("> tree1: after", tree1)
		// console.log("> tree2: after", tree2)
		// console.log("> child1:", child1.dataToArray())
		// console.log("> child2:", child2.dataToArray())
		return [child1,child2];
	}
}

function generateRandonNumberInRange(min, max) {
	let random = min - 1;
	while (random < min || random > max || random % 2 == 0) {
		random = Math.floor(Math.random() * (max - min + 1)) + min;
	}
	return random;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateSimbols(max) {
    const random = getRandomInt(max);
    return operations[random];
}

function generateConstant(max) {
    const random = getRandomInt(max);
    return constans[random];
}

function generateFunction(max) {
    const random = getRandomInt(max);
    return functions[random];
}

exports.module = {
    generateRandonNumberInRange,
    getRandomInt,
	mutation,
	crossover,
	generateSimbols,
	generateConstant
}