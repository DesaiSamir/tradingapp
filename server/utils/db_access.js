const User = require("../db/user");
const UserProfile = require("../db/user_profile");
const ProviderAccount = require("../db/provider_account");

function updateProviderUserInfo(session) {
    const params = session;
    User.getUserByUsername(params.userid)
        .then((user) => {
            UserProfile.updateUserProfile(user.user_id, params);
            ProviderAccount.updateProviderAccount(params);
        });
}


module.exports.updateProviderUserInfo = updateProviderUserInfo;
