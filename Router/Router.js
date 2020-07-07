const _ = require('lodash');
const axios = require('axios');

class Router {

	// ================ Setup ================

	name = 'Router';

	ips = [];
	cache = [];
	axios;
	config;

	/** Accept construction variables  **/
	constructor() {
		this.config = require('./config');
		this.axios = axios.create();
	}

	/** Computed props **/

	receivedNewIp() {
		return this.ip() !== this.cachedIp();
	}

	attempts() {
		return this.cache.length;
	}

	ip() {
		return _.last(this.ips);
	}

	cachedIp() {
		return _.last(this.cache);
	}

	/**
	 * Initializer
	 *
	 * Required for multiple runs in a loop when scripting.
	 * @returns {Promise<*>}
	 */

	async init() {
		return new Promise(async (resolve, reject) => {
			try {

				if (!this.ready) {
					console.log('Router class not yet booted, booting...');
					this.ips = [];
					this.ready = true;
				}

				this.ips.push(await this.getPublicIp());
				this.cache = [];
				this.cache.push(this.ip());

				resolve();
			} catch (err) {
				reject(err.message);
			}
		});
	}

	/**
	 * Primary function that triggers the renewal from outside the class (ie in a script)
	 *
	 * @returns {Promise<*>}
	 */

	async renew() {
		return new Promise(async (resolve, reject) => {

			await this.init();

			let hasConnection = false;

			while (!this.receivedNewIp() && this.attempts() < 3) {

				console.log('Attempting IP renewal...');

				try {
					await this.requestNewIp();
				} catch (err) {
					console.log(err.message, this.name, 'fatal');
				}

				await this.delay(1000);

				let connectionAttempt = 0;

				while (!hasConnection && connectionAttempt < 5) {
					console.log('Waiting for connectivity...');
					hasConnection = await this.checkConnectivity();
					await this.delay(2500);
					connectionAttempt++;
				}

				if (hasConnection) {
					console.log('Router rebooted, checking for new IP');

					await this.checkForNewIp();

					if (this.receivedNewIp()) {
						console.log('Successfully cycled IP! Exiting...');
						this.ips.push(this.cachedIp());
						return resolve();
					}
				}

				console.log('Attempt #' + this.attempts() + ' failed. Did not receive a new IP! Retrying...');

			}

			if (!this.receivedNewIp()) {
				this.cache = [];
				reject('Attempts to receive a new IP failed, aborting to avoid contamination.');
			}

		});
	}

	/**
	 * Sends a request to Automate api to trigger the Flow on the linked Android device
	 *
	 * @returns {Promise<*>}
	 */
	async requestNewIp() {
		return new Promise(async (resolve, reject) => {
			try {

				console.log('Sending renewal cloud message to phone');
				let response = this.axios.post('https://llamalab.com/automate/cloud/message', this.config);
				// TODO: Check to ensure response is valid...
				console.log('Pausing for the renewal task to complete...');
				await this.delay(13000);
				console.log('Continuing...');
				resolve(true);

			} catch (err) {
				resolve(false);
			}
		});
	}

	/**
	 * Checks to see if we have public internet yet
	 *
	 * @returns {Promise<*>}
	 */
	async checkConnectivity() {
		return new Promise(async (resolve, reject) => {
			try {
				await this.getPublicIp();
				resolve(true);

			} catch (err) {
				resolve(false);
			}
		});
	}

	/**
	 * Checks to ensure we did not receive a duplicate IP from the carrier
	 *
	 * @returns {Promise<*>}
	 */
	async checkForNewIp() {
		return new Promise(async (resolve, reject) => {
			try {

				this.cache.push(await this.getPublicIp());

				if (!this.receivedNewIp()) {
					console.log('Did not receive a new IP!', this.name, 'error');
					console.log('Original: ' + this.ip() + ', Received: ' + this.cachedIp());

					return resolve(false);
				}
				else {

					console.log('Received a new IP!');
					console.log('Original: ' + this.ip() + ', Received: ' + this.cachedIp());

					return resolve(true);
				}

			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * Returns the current public IP using IPify service
	 * @returns {Promise<*>}
	 */
	async getPublicIp() {
		return new Promise(async (resolve, reject) => {
			try {

				console.log('Attempting to retrieve public IP');

				const response = await this.axios.get('https://api.ipify.org', { params: { format: 'json' } });
				const ip = _.get(response, 'data.ip');

				if (ip) {
					console.log('Retrieved public IP: ' + ip);

					resolve(ip);
				}
				else {
					reject('Public IP could not be retrieved');
				}

			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * Getters
	 */

	getCurrentIp() {

		return this.ip();
	}

	getIpHistory() {
		return _.get(this, 'ips', []);
	}

	/**
	 * Delay async function
	 * @param duration
	 * @returns {Promise<*>}
	 */

	async delay(duration) {
		return new Promise(async (resolve, reject) => {
			try {

				duration = duration ? parseInt(duration) : 1000;

				setTimeout(() => {
					resolve();
				}, duration);

			} catch (err) {
				reject(err);
			}
		});
	}

}

module.exports = Router;