import { userRepository } from "../db/repository/user-repository.js";
import { errorDefinitions } from "../constants/error-definitions.js";
import PCloudError from "../constants/p-cloud-error.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import passport from "passport";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: true,
  secretOrKey: process.env.JWT_SECRET,
};

const JWTVerify = async (jwtPayload, done) => {
  if (Date.now() > jwtPayload.exp * 1000) {
    return done(new PCloudError(errorDefinitions.AUTH.EXPIRED_TOKEN), false);
  }

  const user = await userRepository.findUserByUsername(jwtPayload.username);
  if (!user) {
    return done(new PCloudError(errorDefinitions.AUTH.LOGIN_REQUIRED), false);
  }

  return done(null, user);
};

export default function configurePassport() {
  passport.use("jwt", new JwtStrategy(jwtOptions, JWTVerify));

  return passport;
}
