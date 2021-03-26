import React from "react";
import IconLink from "../buttons/IconLink";
import Github from "../../res/footer-github.png";

const Footer = () => {
    return (
        <div className="footer">
            <span>
                Developed by <a href="https://github.com/DesaiSamir/tradingapp">Samir Desai</a>, with project scaffolding from <a href="https://github.com/rmbh4211995/passport-react">RyanMichael</a>.
            </span>
            <IconLink
                href={"https://github.com/DesaiSamir/tradingapp"}
                icon={Github}
                title="Github"
                className="social-icon"
                buttonStyle={{ verticalAlign: "sub" }}
            />
        </div>
    );
};

export default Footer;