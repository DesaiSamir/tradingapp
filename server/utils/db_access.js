const User = require("../db/user");
const UserProfile = require("../db/user_profile");

function updateProviderUserInfo(session) {
    const params = session;
    User.getUserByUsername(params.userid)
        .then((user) => {
            UserProfile.updateUserProfile(user.user_id, params);
        });
}

module.exports.updateProviderUserInfo = updateProviderUserInfo;
