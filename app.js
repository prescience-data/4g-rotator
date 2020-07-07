#!/usr/bin/env node
'use strict';

/* Command line arguments */
const argv = require('yargs').argv;

/* Watch for any special commands */
if (argv.command === 'renew') {
	const Router = require('./Router');
	const router = new Router();

	return router.renew().then(() => {
		console.log('4G IP renewal successful...');
	});

}