var db = require('../database');

var Setting = function(record){
    this.setting_name = record.setting_name;
    this.setting_value = record.setting_value;
    this.unit = record.unit;
}

Setting.getUnits = function(){
    const units = ['General', 'Number', '$', '%'];
    return units;
}

Setting.getSettings = async function(){
    const query = `SELECT setting_id id, name, value, unit FROM settings;`
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

Setting.updateSettingById = async function(setting){
    var query = `UPDATE settings s
                SET s.name = '${setting.name}', s.value = '${setting.value}', s.unit = '${setting.unit}' 
                WHERE s.setting_id = '${setting.id}';`
    var result = await db.crudData(query, {});

    if(result){
        return result;
    }

    return null; 
}

Setting.insertSetting = async function (newSetting){
    const qp = newSetting;
    const query = `INSERT INTO tradingapp.settings
                    (name, value, unit)
                    VALUES('${qp.name}', '${qp.value}', '${qp.unit}');`
    const result = await db.crudData(query, qp);
    
    if(result){
        return result;
    }
    return null; 
}

Setting.deleteSetting = async function(setting){
    const query = `DELETE FROM settings WHERE setting_id = ${setting.id};`

    const result = await db.crudData(query, {});
    
    if(result){
        return result;
    }
    return null;
}

Setting.addOrUpdateSetting = async function(settings){
    if(settings.length > 0){
        settings.forEach(s => {            
            if(s.isNew){
                this.insertSetting(s);
            } else {
                if(s.isEdited){
                    this.updateSettingById(s);
                }
            }
        }, this);
    }
    
    return (settings);
}

module.exports = Setting;