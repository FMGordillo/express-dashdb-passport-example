# express-dashdb-passport-example
A simple Node.js application using:
1. [express-generator](https://www.npmjs.com/package/express-generator) to create the Express application
2. [Passport.js](http://passportjs.org) and `passport-local` to authenticate our users
3. [ibm_db](https://www.npmjs.com/package/ibm_db) and [connect-db2](https://www.npmjs.com/package/connect-db2) to connect and persist sessions in the database

## Deploy locally
```
git clone https://github.com/FMGordillo/express-dashdb-passport-example.git
```
Then you must **create** a `.env` file and put your dashDb DSN in there, as this example:

`DASHDB_DSN=DATABASE=XXX;HOSTNAME=XXX;PORT=50000;PROTOCOL=TCPIP;UID=XXX;PWD=XXX;`
```
npm install
npm start
```

## Deploy on Bluemix
The package [cfenv](https://www.npmjs.com/package/cfenv) handles `VCAP_SERVICES` to get the credentials. More info, coming soon

# TODOs
- [ ] Create `Deploy on Bluemix` button
- [ ] Complete README
- [ ] Make an example for login/register handler
