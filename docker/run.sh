cd /app/client
echo "Running NPM Install on client"
npm install
echo "Running NPM Update on client"
npm update
# echo "build client"
# yarn build

cd /app
echo "Running NPM Install on server"
npm install
echo "Running NPM Update server"
npm update
echo "Start Applocation"
npm run start