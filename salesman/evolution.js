const cities = require('./data/cities2.json');

let mutation = {
	arity: 1,
	apply: function(parent) {
		let child = parent;
        const min = 0;
        const max = parent.length - 1;
		let mutationRate = 1.0 / child.length;
		// console.log(">>mutation rate:", mutationRate);
		for (let [index, value] of child.entries()) {
			if (Math.random() < mutationRate) {
                //generar un numero al azar por el cual reemplazar el numero actual (0,)y hacer el cambio
                const exchange = Math.floor(Math.random() * (max - min + 1)) + min;
				const input = child.indexOf(exchange);
				if (exchange > min && exchange < max && input > min && input < max) {
					[child[index], child[input]] = [child[input], child[index]]
				}	
			} 	
		}		
		if ((new Set(child)).size !== child.length) {
			console.log("error mutating")
        }
		return [ child ];
	}
};

let shuffle = {
	arity: 1,
	apply: function(parent) {
		let child = parent;
        child = child.sort(function () {
            return Math.random() - 0.5;
          });
		if ((new Set(child)).size !== child.length) {
			console.log("error mutating")
        }
		return [ child ];
	}
};

let xover = {
	arity: 2,
	apply: function(parent1, parent2) {
		let child1 = [], child2 = [], extra = [...Array(parent1.length).keys()];;
		let xoverpoint = Math.floor(Math.random() * parent1.length);
		for (let i = 0; i < parent1.length; i++) {
			if (i < xoverpoint) {
				child1.push(parent1[i]);
				child2.push(parent2[i]);
			} else {
				child1.push(parent2[i]);
				child2.push(parent1[i]);
			}
			// extra.push(i);
		}
		child1 = child1.concat(extra)
		child2 = child2.concat(extra)
		child1 = child1.filter(onlyUnique);
		child2 = child2.filter(onlyUnique);
		if ((new Set(child1)).size !== child1.length) {
			console.log("error generating individual:")
        }
		if ((new Set(child2)).size !== child2.length) {
			console.log("error generating individual:")
        }
		return [ child1, child2 ];
	}
};

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
  }

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
			let oper = (Math.random() < 0.34) ? opers[0] : opers[1];
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
		if ((new Set(genotype)).size !== genotype.length) {
			console.log("error generating individual:")
        }
        pop.push(genotype);
	}
	return pop;
}

function grow(genotype) {
	let phenotype = [];
	for (let value of genotype)
		phenotype.push(cities[value]);
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
    for(let [index, city] of individual.entries()) {
        if (index == 0){
            continue
        }
        distance += Math.sqrt((individual[index-1]["x"]-individual[index]["x"])**2+(individual[index-1]["y"]-individual[index]["y"])**2)
    }
    return distance;
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
	// let next = [], index = 0;
	// for (let i = 0; i < population.length; i++) {
	// 	let chosen = { genotype: population[i], fitness: fitness[i] };
	// 	for (let j = 0; j < offspringSize[i]; j++) {
	// 		let child = { genotype: offspring[index], fitness: offspringFitness[index] };
	// 		if (child.fitness <= chosen.fitness)
	// 			chosen = child;
	// 		index++;
	// 	}
	// 	next.push(chosen.genotype);
	// }
	// return next;
}

evolutionaryAlgorithm(100,1000,1000);