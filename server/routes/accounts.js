var express = require('express');
const ProviderAccount = require('../db/provider_account');
const patterns = require('../db/pattern');
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
	if(result && result.length > 0){
		const symbols = [...new Set(result.map(s => `'${s.Symbol}'`))].toString();
		patterns.updatePatternIfHasPosition(symbols);
		res.send(result)
	} else {
        res.send([]);
    }
});

module.exports = router;
