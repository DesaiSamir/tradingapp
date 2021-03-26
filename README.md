# Trading companion for Tradestation

Tradingapp is an idea that will allow user to find patterns and create custom logic to take some trades.

```bash
# with npm
# install server dependencies at root 
# install client dependencies in "clinet" folder
npm install


# or with Yarn for both server and client
yarn install
```

## Usage

You'll need Tradeshtation `client_id` and `secret` for you to use this application.

Rename a sample `.env.example` file to `.env` file in the root directory of your project. Add your `client_id` and `secret` in the fields below to use this APIs.

For example:

```dosini
TS_CLIENT_ID="<TS_CLIENT_ID>"
TS_CLIENT_SECRET="<TS_CLIENT_SECRET>"
```

`process.env` now has the keys and values you defined in your `.env` file and these are loaded in `config.js` file present in the `./server` directory. You can see in the below example by default the `base_url` is set to simulated account. 

```javascript
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
```

## Usage

Run below commands which will start both `server` (running at port 3001) and a `client` (running at port 3000).

```bash
# using npm
npm run start

#using yarn
yarn start
```

This is just a beginning of a idea, feedback and changes are welcome.