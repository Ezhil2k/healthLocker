const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const passportConfig = require('./config/passport.js');

const RegisterApi = require('./routes/registerApi.js');
const loginApi = require('./routes/loginApi.js');
const userApi = require('./routes/userApi.js')
const lockerApi = require('./routes/lockerApi.js')
const recordApi = require('./routes/recordApi.js')
const queryApi = require('./routes/queryApi.js')
const tokenApi = require('./routes/tokenApi.js')
const readApi = require('./routes/readApi.js')

const PORT = '4200'
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());
passportConfig(passport);

app.use("/register",  RegisterApi);
app.use("/login", loginApi);
app.use("/invokeUser", passport.authenticate('jwt', { session: false }), userApi);
app.use("/invokeLocker", passport.authenticate('jwt', { session: false }), lockerApi);
app.use("/invokeRecord", passport.authenticate('jwt', { session: false }), recordApi);
app.use("/query", passport.authenticate('jwt', { session: false }), queryApi);
app.use("/invokeToken", passport.authenticate('jwt', { session: false }), tokenApi);
app.use("/read", passport.authenticate('jwt', { session: false }), readApi);



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

