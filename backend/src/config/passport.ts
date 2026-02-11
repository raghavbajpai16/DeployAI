import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with same email (link account)
                const email = profile.emails?.[0]?.value;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.googleId = profile.id;
                        if (!user.avatar) {
                            user.avatar = profile.photos?.[0]?.value;
                        }
                        await user.save();
                        return done(null, user);
                    }
                }

                // Create new user
                user = await User.create({
                    googleId: profile.id,
                    email: email,
                    firstName: profile.name?.givenName || 'User',
                    lastName: profile.name?.familyName || '',
                    avatar: profile.photos?.[0]?.value,
                });

                done(null, user);
            } catch (error: any) {
                done(error, undefined);
            }
        }
    )
);

export default passport;
