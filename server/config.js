const fs = require("fs");

const readFileSync = filename => fs.readFileSync(filename).toString("utf8");

// Constants
module.exports = {
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
      ? readFileSync(process.env.DATABASE_PASSWORD)
      : null
  },
  port: process.env.PORT || 3001,
  // if you're not using docker-compose for local development, this will default to 8080
  // to prevent non-root permission problems with 80. Dockerfile is set to make this 80
  // because containers don't have that issue :)
  ts: {
    client_id: process.env.TS_CLIENT_ID,
    client_secret: process.env.TS_CLIENT_SECRET,
    base_url: process.env.TS_BASE_URL_SIM,
    base_url_sim: process.env.TS_BASE_URL_SIM,
    base_url_live: process.env.TS_BASE_URL_LIVE,
    cookie_secret: process.env.COOKIE_SECRET,
    api_callback: process.env.API_CALLBACK,
    session_data: null
  }
};
