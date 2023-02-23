import * as THREE from "three";

export default {
	/**
	 * @type {number}
	 */
	INV_1000: 1.0 / 1000.0,

	/**
	 * 
	 * @param {string} str 
	 * @param {number} n 
	 */
	prependLog(str, n) {
		let s = "";
		for (let i = 0; i < n; i++) {
			s += "\t";
		}
		s += str;
		console.log(s);
	},
};
