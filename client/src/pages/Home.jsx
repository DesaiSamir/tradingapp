import React from "react";
import Terminal from "../components/displays/Terminal";

const Home = ({parentStyles}) => {
    const parentClasses = parentStyles();
    
    return (
        <div className={parentClasses.page} style={{ textAlign: "center" }}>
            <p className={parentClasses.pageTitle}>Simple OAuth with Node.js</p>
            <p style={{ fontSize: 20 }}>
                Passport.js contains support for over
                <span style={{ color: "var(--primary-red)" }}> 500+ </span>
                Get started today with just a username and password for
                apps like Facebook, Instagram, and Google.
            </p>
            <Terminal
                userData={[{passport: "passport.authenticate('facebook')"}]}
                title="Terminal"
            />
        </div>
    );
};

export default Home;
