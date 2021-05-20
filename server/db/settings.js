var db = require('../database');

var Setting = function(record){
    this.setting_name = record.setting_name;
    this.setting_value = record.setting_value;
}

Setting.getSettings = async function(){
    const query = `SELECT * FROM settings;`
    const result = await db.getData(query);
    
    if(result){
        return result;
    }
    return null;
}

Setting.getSettingsByName = async function(setting_name){
    const query = `SELECT * FROM settings WHERE name = '${setting_name}';`
    const result = await db.getData(query);
    
    if(result){
        return result[0];
    }
    return null;
}

Setting.updateSettingByName = async function(setting_name, setting_value){
    var query = `UPDATE settings s
                SET s.value = '${setting_value}'
                WHERE s.name = '${setting_name}';`
    var result = await db.crudData(query, {});

    if(result){
        return result;
    }

    return null; 
}

Setting.insertSetting = async function (newSetting){
    const qp = newSetting;
    const query = `INSERT INTO tradingapp.settings
                    (name, value)
                    VALUES('${qp.setting_name}', ${qp.setting_value};`
    const result = await db.crudData(query, newSetting);
    
    if(result){
        return result;
    }
    return null; 
}

Setting.deleteSetting = async function(setting_name){
    const query = `DELETE FROM settings WHERE name = ${setting_name};`

    const result = await db.crudData(query, {});
    
    if(result){
        return result;
    }
    return null;
}

Setting.addOrUpdateSetting = async function(setting){
    const newSetting = new Setting({            
        setting_name: setting.setting_name,
        setting_value: setting.setting_value
    });

    const settingExist = await this.getSettingsByName(newSetting.setting_name);
    if(settingExist){
        this.updateSettingByName(newSetting.setting_name, newSetting.setting_value);
    } else {
        this.insertSetting(newSetting);
    }
    
    return (setting);
}

module.exports = Setting;