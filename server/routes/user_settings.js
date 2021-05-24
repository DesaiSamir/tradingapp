var express = require('express');
var router = express.Router();
var s = require('../db/user_setting');

/* GET user settings. */
router.get('/', async function(req, res, next) {
	const user_settings = await s.getSettings();
	if(user_settings){
		user_settings.forEach(s => {
			s.settings = JSON.parse(s.settings)
		});
		res.send(user_settings);
	} else {
		res.send([]);
	}
});

router.get('/:username', async function(req, res, next) {
	const user_settings = await s.getSettingsByUsername(req.params.username);
	if(user_settings){
		user_settings.settings = JSON.parse(user_settings.settings);
		res.send(user_settings);
	} else {
		res.send([]);
	}
});

// router.post('/', async function(req, res, next) {
// 	const payload = req.body;
// 	const user_settings = await s.addOrUpdateSetting(payload);
// 	if(user_settings){
// 		res.send(user_settings);
// 	} else {
// 		res.send([]);
// 	}
// });

// router.put('/', async function(req, res, next) {
// 	const payload = req.body;
// 	const user_settings = await s.addOrUpdateSetting(payload);
// 	if(user_settings){
// 		res.send(user_settings);
// 	} else {
// 		res.send([]);
// 	}
// });

// router.delete('/:name', async function(req, res, next) {
// 	const user_settings = await s.deleteSetting(req.params.name);
// 	if(user_settings){
// 		res.send(user_settings);
// 	} else {
// 		res.send([]);
// 	}
// });

module.exports = router;
