export default class Cell {
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has a north wall
	 */
	up = true;
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has a west wall
	*/
	left = true;
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has an east wall
	 */
	right = true;
	/**
	 * @type {boolean}
	 * @default true
	 * @description Whether the cell has a south wall
	 */
	down = true;
	/**
	 * @type {number}
	 * @default 0
	 */
	x = 0;
	/**
	 * @type {number}
	 * @default 0
	 */
	y = 0;
	/**
	 * @type {number}
	 */
	lightMapValue = 1.0;

	/**
	 * @type {Cell}
	 */
	above = null;
	/**
	 * @type {Cell}
	 */
	below = null;
	/**
	 * @type {Cell}
	 */
	leftOf = null;
	/**
	 * @type {Cell}
	 */
	rightOf = null;

	constructor(x = 0, y = 0, up = true, left = true, right = true, down = true) {
		this.x = x;
		this.y = y;
		this.up = up;
		this.left = left;
		this.right = right;
		this.down = down;
	}
	secluded() {
		return (this.up && this.left && this.right && this.down);
	}
};
