/** 
# Copyright 2017 IBM All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
require('dotenv').config();
var ibmdb = require('ibm_db'),
    cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv(),
    credentials;
if (appEnv.isLocal) credentials = process.env.DASHDB_DSN;
else credentials = process.env.DASHDB_DSN;

// TODO: Does this solve anything?
// var connection = ibmdb.openSync(credentials);

exports.example = (cb) => {
    process.nextTick(() => {
        console.log("Executing", "example");
        ibmdb.open(credentials, (err, conn) => {
            if (err) return console.error(err);

            conn.query("SELECT FIRST_NAME, LAST_NAME, EMAIL, WORK_PHONE from GOSALESHR.employee FETCH FIRST 10 ROWS ONLY", (err, data) => {
                if (err) cb(err, null);
                else cb(null, data);
            });
            conn.close(() => {
                console.log("conn closed");
            });
        });
    });
}

exports.findByEmployeeCode = (code, cb) => {
    process.nextTick(() => {
        console.log("Executing", "findByEmployeeId");
        ibmdb.open(credentials, (err, conn) => {
            if (err) return console.error(err);

            conn.query("select * from dash11065.AMCHAM_COMPANIES WHERE EMPLOYEE_CODE=?", [{
                "ParamType": "INPUT",
                SQLType: "INTEGER",
                Data: code
            }], (err, data) => {
                if (err) cb(err, null);
                else cb(null, data);
            });
            conn.close(() => {
                console.log("conn closed");
            });
        });
    });
}
  
// FIXME: Is this ok? What is wrong?
exports.createSessionDatabase = (sessionStore) => {
    sessionStore.hasDatabaseTable((error, hasTable) => {
      if (error) {
        // deal with it
        console.log(error);
        return;
      }
      if (hasTable === false) {
        sessionStore.createDatabaseTable(function (error) {
          console.log(error)
        });
      }
      sessionStore.close(function (error) {
        if (error) {
          // deal with it
          console.log(error)
          return;
        }
      });
    });
}