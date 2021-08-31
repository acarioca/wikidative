## Data analytics web application

Code base for COMP5347 project from Group 7

## Steps to run

- 1. Run npm install the home directory to install the dependencies. Then run a npm update to ensure that the latest packages are being used.
- 2. Start the MongoDB server. Use the command -> mongod --dbpath <database file path>
- 3. The data is imported into the database "wikidata" under the collections name "revisions." If using Windows, use the "batchdataimport.bat" file to import data into the database from the revisions directory. For MAC users, the following terminal command to import all files into the database: ls -1 *.json | while read jsonfile; do mongoimport  --jsonArray --db wikidata --collection revisions --file $jsonfile --type json; done
- 4. Start the elastic search server 
- 5. Run data.js file--> node data.js in root folder.
- 6. Start both BE and FE servers-> "node server.js" in root folder and "npm run serve" in wikifrontend folder 




