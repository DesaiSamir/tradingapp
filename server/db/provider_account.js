var db = require('../database');
const Provider = require('./provider');

//User object constructor
var ProviderAccount = function(record){
    this.provider_id = record.provider_id;
    this.can_day_trade = record.can_day_trade;
    this.day_trading_qualified = record.day_trading_qualified;
    this.name = record.name;
    this.account_key = record.account_key;
    this.type = record.type;
    this.type_desc = record.type_desc;
    this.is_simulated = record.is_simulated;
};

ProviderAccount.createProviderAccount = function(newProviderAccount) {
    const qp = newProviderAccount;
    const query = `INSERT INTO provider_account (provider_id, can_day_trade, day_trading_qualified, name, account_key, type, type_desc, is_simulated)
        VALUES (${qp.provider_id}, '${qp.can_day_trade}', '${qp.day_trading_qualified}', '${qp.name}', '${qp.account_key}', '${qp.type}', '${qp.type_desc}', ${qp.is_simulated});`;
    
    db.crudData(query, newProviderAccount);
};

ProviderAccount.updateProviderAccountById = function(providerAccount) {
    const qp = providerAccount;

    const query = `UPDATE provider_account
            SET can_day_trade='${qp.can_day_trade}', day_trading_qualified='${qp.day_trading_qualified}', type='${qp.type}', type_desc='${qp.type_desc}', is_simulated=${qp.is_simulated}, updated=current_timestamp()
            WHERE account_id='${qp.account_id}' AND provider_id='${qp.provider_id}' AND account_key='${qp.account_key}'
            AND (can_day_trade <> '${qp.can_day_trade}'
                OR day_trading_qualified <> '${qp.day_trading_qualified}'
                OR type <> '${qp.type}'
                OR type_desc <> '${qp.type_desc}'
                OR is_simulated <> '${qp.is_simulated}');`;
    
    db.crudData(query, providerAccount);
}

ProviderAccount.getProviderAccountByProviderId = async function(provider_id, account_key) {
    const query = `Select * from provider_account where provider_id = ${provider_id} AND account_key = ${account_key}`;
    
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return null;
};

ProviderAccount.updateProviderAccount = function (params) {
    
    const providerUserData = params;
    providerUserData.forEach(async function(account) {
        const provider = await Provider.getProviderByName(params.provider);
        if (provider){
            var newProviderAccount = new ProviderAccount({
                provider_id: provider.provider_id,
                can_day_trade: account.CanDayTrade,
                day_trading_qualified: account.DayTradingQualified,
                name: account.Name,
                account_key: account.Key,
                type:account.Type,
                type_desc: account.TypeDescription,
                is_simulated: account.Name.startsWith('SIM') ? 1 : 0,
            });
            const providerAccount = await this.getProviderAccountByProviderId(provider.provider_id, account.Key);
            if(providerAccount){
                this.updateProviderAccountById(newProviderAccount);
            } else {
                this.createProviderAccount(newProviderAccount);
            }
        } 
    }, this);
    
};

module.exports= ProviderAccount;