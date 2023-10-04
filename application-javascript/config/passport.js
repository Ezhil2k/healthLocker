var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}

const dotenv = require("dotenv");

dotenv.config();
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = "some secreat.";

module.exports =(passport) => {
     passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
      
      const user = {
        clientName: jwtPayload.userName,
        org: jwtPayload.org,
        department: jwtPayload.department,
        msp: jwtPayload.msp,
        role: jwtPayload.role, 
        };
      return done(null, user);
    })
  );
};
