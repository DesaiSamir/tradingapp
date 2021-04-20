var db = require('../database');


//Provider object constructor
var Provider = function(record){
    this.provider_name = record.provider_name;
};

Provider.createProvider = function (newProvider) {    
    return db.promise().query(`INSERT INTO provider (provider_name) VALUES ('${newProvider.provider_name}')`);
};
Provider.getProviderById = function (providerId, result) {
    return db.promise().query(`Select * from provider where provider_id = ${providerId};`);   
};

Provider.getProviderByName = async function (providerName) {
    const query = `Select * from provider where provider_name = '${providerName}';`

    const result = await db.getData(query);
    if(result){
        return result[0];
    }
    return null;
};

module.exports= Provider;