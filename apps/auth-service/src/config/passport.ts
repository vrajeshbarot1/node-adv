import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findUserByEmail, createUser } from '../models/auth.model';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      if (!email) return done(new Error("No email found from Google profile"));

      let user = await findUserByEmail(email);

      if (!user) {
        user = await createUser(email, profile.displayName, "OAUTH_USER", "USER", ["user:read"]);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
