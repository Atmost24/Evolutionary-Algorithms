let mutation = {
	arity: 1,
	apply: function (parent) {
		let child = parent;
		const min = 0;
		const max = parent.length - 1;
		let mutationRate = 1.0 / child.length;
		for (let [index, value] of child.entries()) {
			if (Math.random() < mutationRate) {
				//generar un numero al azar por el cual reemplazar el numero actual (0,)y hacer el cambio
				const exchange = generateRandonNumberInRange(min, max);
				const input = child.indexOf(exchange);
				if (exchange > min && exchange < max && input > min && input < max) {
					[child[index], child[input]] = [child[input], child[index]];
				}
			}
		}
		verify(child, "mutation");
		return [child];
	},
};

let insertion_mutation_varied = {
	arity: 1,
	apply: function (parent) {
		let child = parent.slice();
		const min = 0;
		const max = parent.length - 1;
		let mutationRate = 1.0 / child.length;
		for (let [index, value] of child.entries()) {
			if (Math.random() < mutationRate) {
				const location = generateRandonNumberInRange(min, max);
				child.splice(index, 1);
				child.splice(location, 0, value);
			}
		}
		verify(child, "insertion_mutation_varied");
		return [child];
	},
};

let single_insertion_mutation = {
	arity: 1,
	apply: function (parent) {
		let child = parent.slice();
		const min = 0;
		const max = parent.length - 1;
		const index = generateRandonNumberInRange(min, max);
		const value = child[index];
		const location = generateRandonNumberInRange(min, max);
		child.splice(index, 1);
		child.splice(location, 0, value);
		verify(child, "single_insertion_mutation");
		return [child];
	},
};

let order_crossover = {
    arity: 2,
    apply: function (parent1, parent2) {
        let child = parent1.slice(), child1 = [];
		let index = 0;
		const min = 0;
		const max = parent.length - 1;
		//select random index and copy the rest of them from parent 1
		const position = generateRandonNumberInRange(min, max-1);
		const range = generateRandonNumberInRange(position+1, max);
		const subset = child.slice(position,range);
		parent2.forEach(element => {
			if ( index >= position && index <= range ) {
				child1.concat(subset);
				index = range + 1;
			}
			if ( !subset.includes(element) ) {
				child1.push(element);
				index += 1;
			}

		});
		// iterate through parent 2 and see if they are in the substring, if they are not then added to parent 1
        return [child1,child1]
    }
};

let xover = {
	arity: 2,
	apply: function (parent1, parent2) {
		let child1 = [],
			child2 = [],
			extra = [...Array(parent1.length).keys()];
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
		child1 = child1.concat(extra);
		child2 = child2.concat(extra);
		child1 = child1.filter(onlyUnique);
		child2 = child2.filter(onlyUnique);
		verify(child1, "xover");
		verify(child2, "xover");
		return [child1, child2];
	},
};

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function verify(collection, operation) {
	if (new Set(collection).size !== collection.length) {
		console.error("error verify function:", operation);
		throw new Error(`${operation} makes information be lost`);
	}
}

function generateRandonNumberInRange(min, max) {
	let random = min - 1;
	while (random < min || random > max) {
		random = Math.floor(Math.random() * (max - min + 1)) + min;
	}
	return random;
}

exports.operators = {
	mutation,
	insertion_mutation_varied,
	single_insertion_mutation,
	xover,
};
