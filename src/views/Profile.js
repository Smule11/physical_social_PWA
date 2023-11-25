import React, { useState, useEffect } from 'react';
import BannerAd from '../components/BannerAd';
import NavBar from '../components/NavBar';
import { signOut } from '../services/auth';
import { auth } from '../services/firebaseConfig';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Fetch user and friends data. This is a placeholder.
        // setUser(fetchUserData());
        // setFriends(fetchFriendsData());
    }, []);

    const handleLogout = () => {
        // Call your auth service to log out
    };

    const handleDeleteAccount = () => {
        // Call your service to delete the user account
    };

    return (
        <div className="profile-container">
            <BannerAd />
            <h2>Profile</h2>

            {/* Display the current user's email and email verified status */}
            {auth.currentUser && (
                <>
                    <div className="user-email">
                        <p>{auth.currentUser.email}</p>
                    </div>
                    <div className="user-email">
                        <p>{auth.currentUser.emailVerified ? 'Email verified' : 'Email not verified'}</p>
                    </div>
                </>
            )}

            {user && (
                <>
                    <img src={user.icon} alt="User Icon" className="user-icon" />
                    <h2>{user.name}</h2>
                    <button>Edit Profile</button>

                    <div className="friends-list">
                        {friends.map((friend, index) => (
                            <img key={index} src={friend.icon} alt={friend.name} className="friend-icon" />
                        ))}
                    </div>
                </>
            )}

            <div className="button-container">
                <button onClick={signOut}>Log Out</button>
                <button onClick={handleDeleteAccount}>Delete Account</button>
                <button>Go Pro (Remove Ads)</button>
            </div>

            <NavBar selected="profile" />
        </div>
    );
}

export default Profile;