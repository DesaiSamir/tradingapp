const User = require("../db/user");
const UserProfile = require("../db/user_profile");

function updateProviderUserInfo(session) {
    const params = session;
    User.getUserByUsername(params.userid)
        .then((user) => {
            if(user && user.user_id) {
                UserProfile.updateUserProfile(user.user_id, params);
            } else {
                console.log({error: user})
            }
        });
}

module.exports.updateProviderUserInfo = updateProviderUserInfo;
