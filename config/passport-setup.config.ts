import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from "dotenv";
import { dbCommon } from '../models';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await dbCommon.utilisateurs.findByPk(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Vérifie si l'utilisateur existe déjà dans la base de données
                let user = await dbCommon.utilisateurs.findOne({
                    where: { googleId: profile.id },
                });

                if (!user) {
                    // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec les informations du profil Google
                    user = await dbCommon.utilisateurs.create({
                        googleId: profile.id,
                        identifiant: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }

                // Termine le processus d'authentification en passant l'utilisateur à la fonction de rappel
                done(null, user);
            } catch (error) {
                console.log(error);
                done(error, null);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: '/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Vérifie si l'utilisateur existe déjà dans la base de données
                let user = await dbCommon.utilisateurs.findOne({
                    where: { facebookId: profile.id },
                });

                if (!user) {
                    // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec les informations du profil Facebook
                    user = await dbCommon.utilisateurs.create({
                        facebookId: profile.id,
                        identifiant: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }

                // Termine le processus d'authentification en passant l'utilisateur à la fonction de rappel
                done(null, user);
            } catch (error) {
                console.log(error);
                done(error, null);
            }
        }
    )
);

export default passport;