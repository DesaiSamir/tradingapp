import React, { useContext } from "react";
import UserProvider from "../contexts/UserProvider";
import Terminal from "../components/displays/Terminal";
import Col from "../components/wrappers/Col";
import _ from "lodash";

const LoginMsg = "Uh oh, there's nothing to show! " +
    "Login to see how much of your invaluable personal " +
    "data tech companies have at their disposal.";

const Profile = ({parentStyles}) => {
    const parentClasses = parentStyles();
    const userData = [useContext(UserProvider.context)];
    const text = _.isEmpty(userData) ? LoginMsg: "Explore Your Data";

    return (
        <div className={parentClasses.page}>
            <p className={parentClasses.pageTitle} style={{ textAlign: "center" }}>
                {text}
            </p>

            <Col className={parentClasses.col8}>
                <Terminal
                    userData={userData}
                    title="Profile Data"
                />
            </Col>
            <div style={{ marginBottom: 20 }} />
        </div>
    );
};

export default Profile;