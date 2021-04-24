var express = require('express');
const ProviderAccount = require('../db/provider_account');
var router = express.Router();
const helper = require('../utils/helpers');

router.get('/:userid', async function(req, res, next) {
	const url = `/v2/users/${req.params.userid}/accounts`;
    const result = await helper.send(req, res, 'GET', url);
	if(result){
		ProviderAccount.updateProviderAccount(result);
		res.send(result)
	}
});

router.get('/balances/:key', async function(req, res, next) {
	const url = `/v2/accounts/${req.params.key}/balances`;
    const result = await helper.send(req, res, 'GET', url);
	if(result){
		res.send(result)
	}
});

router.get('/positions/:key', async function(req, res, next) {
	const url = `/v2/accounts/${req.params.key}/positions`;
    const result = await helper.send(req, res, 'GET', url);
	if(result){
		res.send(result)
	}
});

module.exports = router;
