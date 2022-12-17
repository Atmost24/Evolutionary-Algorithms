let mutation = {
	arity: 1,
	apply: function(parent) {
		let child = [];
		let mutationRate = 1.0 / parent.length;
		for (let value of parent) {
			if (Math.random() < mutationRate) {
				let change = Math.random() - 0.5;
				child.push(value + change);
			} else
				child.push(value);
		}
		return [ child ];
	}
};

let xover = {
	arity: 2,
	apply: function(parent1, parent2) {
		let child1 = [], child2 = [];
		let xoverpoint = Math.floor(Math.random() * parent1.length);
		for (let i = 0; i < parent1.length; i++) {
			if (i < xoverpoint) {
				child1.push(parent1[i]);
				child2.push(parent2[i]);
			} else {
				child1.push(parent2[i]);
				child2.push(parent1[i]);
			}
		}
		return [ child1, child2 ];
	}
};

/*let arithmetical_xover = {
	arity: 2,
	apply: function(parent1, parent2) {
		let children = [];
		return children;
	}
};*/

function evolutionaryAlgorithm(total, n, iters) {
	console.log("> generating initial population");
	let population = generatePopulation(total, n);
	let fitness = evaluate(population);
	let opers = [ mutation, xover ];
	printStatistics(0, fitness);
	for (let i = 1; i <= iters; i++) {
		let offspring = [];
		let offspringSize = [];
		for (let genotype of population) {
			let oper = (Math.random() < 0.5) ? opers[0] : opers[1];
			let parents = chooseParents(genotype, population, oper.arity);
			let children = repair(mate(parents, oper));
			offspring = offspring.concat(children);
			offspringSize.push(children.length);
		}
		let offspringFitness = evaluate(offspring);
		population = select(population, offspring, offspringSize, fitness, offspringFitness);
		fitness = evaluate(population);
		printStatistics(i, fitness);
	}
}

function select(population, offspring, offspringSize, fitness, offspringFitness) {
	// elitismo puro
	let grouped = [];
	for (let i = 0; i < population.length; i++)
		grouped.push({ genotype: population[i], fitness: fitness[i] });
	for (let i = 0; i < offspring.length; i++)
		grouped.push({ genotype: offspring[i], fitness: offspringFitness[i] });
	grouped.sort(function (a, b) { return a.fitness - b.fitness; });
	let next = [];
	for (let i = 0; i < population.length; i++)
		next.push(grouped[i].genotype);
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

function chooseParents(genotype, population, arity) {
	let parents = [ genotype ];
	while (parents.length < arity) {
		let index = Math.floor(Math.random() * population.length);
		parents.push(population[index]);
	}
	return parents;
}

function mate(parents, oper) {
	if (oper.arity == 1)
		return oper.apply(parents[0]);
	return oper.apply(parents[0], parents[1]);
}

function printStatistics(iter, fitness) {
	let maximum = 0, minimum = 0, average = 0;
	for (let i = 0; i < fitness.length; i++) {
		maximum = fitness[i] > fitness[maximum] ? i : maximum;
		minimum = fitness[i] < fitness[minimum] ? i : minimum;
		average += fitness[i] / fitness.length;
	}
	console.log(">", iter, ":", fitness[minimum], fitness[maximum], average);
}

function evaluate(population) {
	let result = [];
	for (let genotype of population) {
		let phenotype = grow(genotype);
		result.push(rastrigin(phenotype));
	}
	return result;
}

// métrica de desempeño
function rastrigin(inividual) {
	let rastringin = 10 * inividual.length;
	for (let value of inividual)
		rastringin += (value * value) - (10 * Math.cos(2 * Math.PI * value));
	return rastringin;
}

// generación de fenotipos
function grow(genotype) {
	let phenotype = [];
	for (let value of genotype)
		phenotype.push(5.12 * value);
	return phenotype;
}

// generacion de genotipos
function generatePopulation(total, n) {
	let pop = [];
	for (let i = 0; i < total; i++) {
		let genotype = [];
		for (let j = 0; j < n; j++)
			genotype.push(2 * (Math.random() - 0.5));
		pop.push(genotype);
	}
	return pop;
}

// reparación de genes
function repair(children) {
	for (let child of children) {
		for (let i = 0; i < child.length; i++)
			child[i] = Math.min(1, Math.max(-1, child[i]));
	}
	return children;
}

evolutionaryAlgorithm(100, 10, 100);