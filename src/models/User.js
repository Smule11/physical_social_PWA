/* This is a class-based representation for a user. In the real-world, these 
classes could come with methods to save themselves, retrieve information 
from the database, etc. For simplicity, I'm showing just the basic structure. */

import { auth } from './firebaseConfig';

class AuthService {
    // Sign up with email and password
    async signUp(email, password) {
        try {
            const response = await auth.createUserWithEmailAndPassword(email, password);
            return { success: true, data: response.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Log in with email and password
    async logIn(email, password) {
        try {
            const response = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, data: response.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Log out
    async logOut() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Other methods, such as Google or Facebook login, can be added here
}

const authService = new AuthService();
export default authService;