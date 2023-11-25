import React from 'react';
import { signOut} from '../services/auth';

import { useAuth } from '../components/AuthContext';
import { auth } from '../services/firebaseConfig';

function ProfilePage() {

    const { currentUser } = useAuth();
    
    console.log("auth: ", auth);
    console.log("currentUser: ", currentUser);

    

    return (
        <div>
        <h2>Your Profile</h2>
        {/* Profile related components and functionalities will be added here */}
        <button onClick={signOut}>Sign Out</button>

        </div>
    );
}

export default ProfilePage;