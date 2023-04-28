import {Router} from "express";
const router = Router();
import {verifySignUp} from "../middleware";
import authController from "../controllers/auth.controller";
import passport from 'passport';

router.post('/signup', [verifySignUp.checkDuplicateUsername], authController.signup);
router.post('/signin', authController.signin);

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/home');
});

router.get(
    '/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/home');
});

export default router;