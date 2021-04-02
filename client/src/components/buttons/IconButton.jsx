import React from "react";

const IconButton = ({ app, styles }) => {
    const { img, href, alt, color, txt, name } = app;
    return (
        <a href={href}
           className={`${styles.btn} ${styles.loginBtn}`}
           style={{ backgroundColor: color, margin: 5, display: "block" }}
           title={txt}
        >
            <img src={img} alt={alt} className={styles.btnIcon} />
            <span className={styles.btnText}> {name.toUpperCase()} Login</span>
        </a>
    );
};

export default IconButton;