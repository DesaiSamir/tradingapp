var express = require('express');
var router = express.Router();
var s = require('../db/settings');

/* GET settings. */
router.get('/', async function(req, res, next) {
	const settings = await s.getSettings();
	if(settings){
		res.send(settings);
	} else {
		res.send([]);
	}
});

router.get('/:name', async function(req, res, next) {
	const settings = await s.getSettingsByName(req.params.name);
	if(settings){
		res.send(settings);
	} else {
		res.send([]);
	}
});

router.post('/', async function(req, res, next) {
	const payload = req.body;
	const settings = await s.addOrUpdateSetting(payload);
	if(settings){
		res.send(settings);
	} else {
		res.send([]);
	}
});

router.put('/', async function(req, res, next) {
	const payload = req.body;
	const settings = await s.addOrUpdateSetting(payload);
	if(settings){
		res.send(settings);
	} else {
		res.send([]);
	}
});

router.delete('/:name', async function(req, res, next) {
	const settings = await s.deleteSetting(req.params.name);
	if(settings){
		res.send(settings);
	} else {
		res.send([]);
	}
});

module.exports = router;
