var db = require('../database');
const Provider = require('./provider');

//User object constructor
var UserProfile = function(record){
    this.user_id = record.user_id;
    this.provider_id = record.provider_id;
    this.access_token = record.access_token;
    this.refresh_token = record.refresh_token;
    this.refreshed_at = record.refreshed_at;
    this.expires_in = record.expires_in;
};

UserProfile.createUserProfile = function (newUserProfile) {
    const qp = newUserProfile;
    const query = `INSERT INTO user_profile (user_id, provider_id, access_token, refresh_token, refreshed_at, expires_in)
        VALUES (${qp.user_id}, ${qp.provider_id}, '${qp.access_token}', '${qp.refresh_token}', '${qp.refreshed_at}', '${qp.expires_in}');`;
    
    db.crudData(query, newUserProfile);
};

UserProfile.updateUserProfileById = async function (userProfile) {
    const qp = userProfile;

    const query = `UPDATE user_profile
            SET access_token='${qp.access_token}', refresh_token='${qp.refresh_token}', refreshed_at='${qp.refreshed_at}', expires_in='${qp.expires_in}', updated = current_timestamp()
            WHERE user_id='${qp.user_id}' AND provider_id='${qp.provider_id}'
            AND (  access_token <> '${qp.access_token}'
                OR refresh_token <> '${qp.refresh_token}'
                OR refreshed_at <> '${qp.refreshed_at}'
                OR expires_in <> '${qp.expires_in}');`;
    
    db.crudData(query, userProfile);
}

UserProfile.getUserProfileByUserId = async function (user_id, provider_id) {
    const query = `SELECT u.username userid, refreshed_at, expires_in, access_token, refresh_token, p.provider_name, CONCAT(u.fname, ' ', u.lname) name
                    FROM user_profile up 
                    JOIN users u ON u.user_id = up.user_id 
                    JOIN provider p ON p.provider_id = up.provider_id 
                    WHERE up.user_id = ${user_id} AND up.provider_id = ${provider_id}`;
    
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return null;
};

UserProfile.updateUserProfile = async function (user_id, params) {
    
    const provider = await Provider.getProviderByName(params.provider);
    
    if (provider){
        var newUserProfile = new UserProfile({
            user_id: user_id,
            provider_id: provider.provider_id,
            access_token: params.access_token,
            refresh_token: params.refresh_token,
            refreshed_at: params.refreshed_at,
            expires_in: params.expires_in,
        });
        const userProfile = await this.getUserProfileByUserId(user_id, provider.provider_id);
        if(userProfile){
            this.updateUserProfileById(newUserProfile);
        } else {
            this.createUserProfile(newUserProfile);
        }
    } 
    
    
};

module.exports= UserProfile;