const node = require('./tree').node;
const Tree = require('./tree').Tree;
const operator = require('./operators').module;
const points = require('./data/points.json');

const c = console.log
const operations = ["x","+","-","X","Y"];
const functions = ["x","+","-"];
const constans = ["X","Y"];

function evolutionaryAlgorithm(total, n, iters) {
	console.log("> generating initial population");
	let population = generatePopulation(total, n);
    let fitness = evaluate(population);
    let opers = [operator.mutation, operator.mutation];
    printStatistics(0, fitness);
    for (let i = 1; i <= iters; i++) {
		let offspring = [];
		let offspringSize = [];
		for (let genotype of population) {
			let oper = Math.random() < 0.5 ? opers[0] : opers[1];
			let parents = chooseParents(genotype, population, oper.arity);
			let children = mate(parents, oper);
			offspring = offspring.concat(children);
			offspringSize.push(children.length);
		}
		let offspringFitness = evaluate(offspring);
		population = select(population, offspring, offspringSize, fitness, offspringFitness);
		fitness = evaluate(population);
		printStatistics(i, fitness);
	}
}

function generatePopulation(total, n) {
    let pop = [];
    for (let i = 0; i < total; i++) {
        const root = new node(operator.generateSimbols(operations.length));
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
    // console.log(">> phenotype:", phenotype);
    return phenotype;
}

function r2(phenotype) {
    const z = [];
    const reference = [];
    for ( let [index, point] of points.entries() ){
        const numeric = [];
        for (element of phenotype) {
            if ( element == "X" ) {
                element = points[index].x
            } 
            else if ( element == "Y") {
                element = points[index].y
            }
            numeric.push(element);
        }
        
        let result = numeric[0];
        for (let i = 0; i < numeric.length; i ++) {
            if ( numeric[i] === "+") result += numeric[i + 1];
            else if ( numeric[i] === "x") result = result * numeric[i + 1];
            else if ( numeric[i] === "-") result -= numeric[i + 1];
        
        }
        z.push(result);
        reference.push(points[index].z);
    }
    return calculateR2(z,reference);
}

function calculateR2(forecast, reference) {
	let avg = 0, ss_res = 0, ss_tot = 0;
	for (let i = 0; i < reference.length; i++) avg += (reference[i]);
	avg /= reference.length;
	for (let i = 0; i < forecast.length; i++) {
		ss_res += Math.pow(forecast[i] - reference[i], 2);
		ss_tot += Math.pow(avg - reference[i], 2);
	}
    // c(">> r2:", 1.0 - ss_res / ss_tot);
	return 1.0 - ss_res / ss_tot;
}



function generateNodeChildren(tree, numOfOperations,n) {
    const maxHeight = n
    while (tree.getHeight() < maxHeight ) {
        const children = tree.getLeaves().flat(10);
        const simbols = [operator.generateSimbols(numOfOperations),operator.generateSimbols(numOfOperations)];
        let non_operable = 0;
        children.forEach(child => {
            if (!constans.includes(child.data)) {
                let node1,node2;
                if (tree.nodeDepth(child) == maxHeight - 1){
                    const constan = [operator.generateConstant(constans.length),operator.generateConstant(constans.length)];
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

function chooseParents(genotype, population, arity) {
	let parents = [genotype];
	while (parents.length < arity) {
		let index = Math.floor(Math.random() * population.length);
		parents.push(population[index]);
	}
	return parents;
}

function mate(parents, oper) {
	if (oper.arity == 1) return oper.apply(parents[0]);
	return oper.apply(parents[0], parents[1]);
}

function printStatistics(iter, fitness) {
	let maximum = 0,
		minimum = 0,
		average = 0;
	for (let i = 0; i < fitness.length; i++) {
		maximum = fitness[i] > fitness[maximum] ? i : maximum;
		minimum = fitness[i] < fitness[minimum] ? i : minimum;
		average += fitness[i] / fitness.length;
	}
	console.log(">", iter, ":", fitness[minimum], fitness[maximum], average);
}

function select(population, offspring, offspringSize, fitness, offspringFitness) {
	// elitismo puro
	// let grouped = [];
	// for (let i = 0; i < population.length; i++)
	// 	grouped.push({ genotype: population[i], fitness: fitness[i] });
	// for (let i = 0; i < offspring.length; i++)
	// 	grouped.push({ genotype: offspring[i], fitness: offspringFitness[i] });
	// grouped.sort(function (a, b) {
	// 	return - a.fitness + b.fitness;
	// });
	// let next = [];
	// for (let i = 0; i < population.length; i++) next.push(grouped[i].genotype);
	// return next;
	// reemplazo elitista
	let next = [], index = 0;
	for (let i = 0; i < population.length; i++) {
		let chosen = { genotype: population[i], fitness: fitness[i] };
		for (let j = 0; j < offspringSize[i]; j++) {
			let child = { genotype: offspring[index], fitness: offspringFitness[index] };
			if (child.fitness >= chosen.fitness)
				chosen = child;
			index++;
		}
		next.push(chosen.genotype);
	}
	return next;
}

evolutionaryAlgorithm(100,4,100);

exports.module = {
    constans,
    operations,
    functions
}