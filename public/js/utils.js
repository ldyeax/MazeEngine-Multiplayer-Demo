var tinyLog = function (name, name2) {

	const now = moment().format();

	if (typeof name === 'string') {
		if (typeof name2 === 'string') {
			return `[${now}] [${name}] [${name2}] `;
		} else {
			return `[${now}] [${name}] `;
		}
	} else {
		return `[${now}] `;
	}

};
