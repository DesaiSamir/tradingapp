import React from "react";
import Terminal from "../components/displays/Terminal";
import { Paper } from "@material-ui/core";

const Profile = ({userData}) => {

    return (
        <Paper>
            <Terminal
                userData={userData}
                title="Profile Data"
                />
        </Paper>
    );
};

export default Profile;