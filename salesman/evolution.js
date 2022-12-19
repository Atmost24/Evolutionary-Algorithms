const cities = require("./data/cities2.json");
const operator = require("./opertator").operators;

function evolutionaryAlgorithm(total, n, iters) {
	console.log("> generating initial population");
	let population = generatePopulation(total, n);
	let fitness = evaluate(population);
	let opers = [operator.single_insertion_mutation, operator.xover];
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
		let genotype = [...Array(n).keys()];
		genotype = genotype.sort(function () {
			return Math.random() - 0.5;
		});
		pop.push(genotype);
	}
	return pop;
}

function grow(genotype) {
	let phenotype = [];
	for (let value of genotype) phenotype.push(cities[value]);
	return phenotype;
}

function evaluate(population) {
	let result = [];
	for (let genotype of population) {
		let phenotype = grow(genotype);
		result.push(distance(phenotype));
	}
	return result;
}

function distance(individual) {
	let distance = 0;
	for (let [index, city] of individual.entries()) {
		if (index == 0) continue;
		distance += Math.sqrt(
			(individual[index - 1]["x"] - individual[index]["x"]) ** 2 +
				(individual[index - 1]["y"] - individual[index]["y"]) ** 2
		);
	}
	return distance;
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

function select(population, offspring, offspringSize, fitness, offspringFitness) {
	// elitismo puro
	let grouped = [];
	for (let i = 0; i < population.length; i++)
		grouped.push({ genotype: population[i], fitness: fitness[i] });
	for (let i = 0; i < offspring.length; i++)
		grouped.push({ genotype: offspring[i], fitness: offspringFitness[i] });
	grouped.sort(function (a, b) {
		return a.fitness - b.fitness;
	});
	let next = [];
	for (let i = 0; i < population.length; i++) next.push(grouped[i].genotype);
	return next;
	// reemplazo elitista
	/*let next = [], index = 0;
	for (let i = 0; i < population.length; i++) {
		let chosen = { genotype: population[i], fitness: fitness[i] };
		for (let j = 0; j < offspringSize[i]; j++) {
			let child = { genotype: offspring[index], fitness: offspringFitness[index] };
			if (child.fitness <= chosen.fitness)
				chosen = child;
			index++;
		}
		next.push(chosen.genotype);
	}
	return next;*/
}

evolutionaryAlgorithm(100, 1000, 1000);
