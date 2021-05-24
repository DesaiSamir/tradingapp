var db = require('../database');

var UserSetting = function(record){
    this.setting_name = record.setting_name;
    this.setting_value = record.setting_value;
}

UserSetting.getSettings = async function(){
    const query = `SELECT * FROM vw_user_settings;`
    const result = await db.getData(query);
    
    if(result){
        return result;
    }
    return null;
}

UserSetting.getSettingsByUsername = async function(username){
    const query = `SELECT * FROM vw_user_settings WHERE username = '${username}';`
    const result = await db.getData(query);
    
    if(result){
        return result[0];
    }
    return null;
}

UserSetting.getSettingsByUserId = async function(user_id){
    const query = `SELECT * FROM vw_user_settings WHERE user_id = ${user_id};`
    const result = await db.getData(query);
    
    if(result){
        return result[0];
    }
    return null;
}

UserSetting.updateSettingByUserId = async function(user_id, user_settings){
    const qp = user_settings;
    try {        
        if(qp.length > 0){
            var query = '';
            qp.forEach(s => {
                query = query + `UPDATE user_settings us SET us.setting_value = '${s.setting_value}'
                        WHERE us.user_id = ${user_id} AND us.setting_id = ${s.setting_id}; \n`
            });
            
            var result = await db.crudData(query, {});

            if(result){
                return result;
            }
        }
    } catch (error) {
        console.error(error);
    }

    return null; 
}

UserSetting.insertSettingByUserId = async function (user_id, user_settings){
    const qp = user_settings;
    try {        
        if(qp.length > 0){
            var query = `INSERT INTO tradingapp.user_settings us (user_id, setting_id, setting_value) VALUES`;
            query = query + Array.prototype.map.call(qp, s => `( ${user_id}, ${s.setting_id}, '${s.setting_value}')`).toString() + ';';
            
            var result = await db.crudData(query, qp);

            if(result){
                return result;
            }
        }
    } catch (error) {
        console.error(error);
    }

    return null; 
}

UserSetting.deleteSettingByUserId = async function(user_id){
    const query = `DELETE FROM user_settings WHERE user_id = ${user_id};`

    const result = await db.crudData(query, {});
    
    if(result){
        return result;
    }
    return null;
}

// UserSetting.addOrUpdateSetting = async function(setting){
//     const newSetting = new Setting({            
//         setting_name: setting.setting_name,
//         setting_value: setting.setting_value
//     });

//     const settingExist = await this.getSettingsByName(newSetting.setting_name);
//     if(settingExist){
//         this.updateSettingByName(newSetting.setting_name, newSetting.setting_value);
//     } else {
//         this.insertSetting(newSetting);
//     }
    
//     return (setting);
// }

module.exports = UserSetting;