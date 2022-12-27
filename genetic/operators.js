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

exports.module = {
    generateRandonNumberInRange,
    getRandomInt
}