import React from 'react';
import BannerAd from '../components/BannerAd';
import NavBar from '../components/NavBar';

const mockActivities = [
    { friend: "Alice", activity: "Jogging" },
    { friend: "Bob", activity: "Reading" },
    // ... more mock data
];

const FriendsFeed = () => {
    return (
        <div>
            <BannerAd />
            <h2>Friends' Activities</h2>
            <ul>
                {mockActivities.map((activity, index) => (
                    <li key={index}>{activity.friend} was {activity.activity}.</li>
                ))}
            </ul>
            <NavBar />
        </div>
    );
}

export default FriendsFeed;