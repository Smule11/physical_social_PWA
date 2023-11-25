import React, { useState } from 'react';
import BannerAd from '../components/BannerAd';
import NavBar from '../components/NavBar';

const ShareActivity = () => {
    const [selectedGroup, setSelectedGroup] = useState('');

    const handleGroupSelection = (group) => {
        setSelectedGroup(group);
        // Additional logic to save/share with this group
    };

    return (
        <div className="share-container">
            <BannerAd />

            <h2>Share with:</h2>
            <div className="group-buttons">
                <button onClick={() => handleGroupSelection('everyone')}>Everyone</button>
                <button onClick={() => handleGroupSelection('no-one')}>No One</button>
                {/* Add additional friend groups here */}
                <button onClick={() => handleGroupSelection('new-group')}>+ New Group</button>
            </div>

            <div className={`selected-group ${selectedGroup}`}>
                Currently sharing with: {selectedGroup}
            </div>

            <NavBar selected="share" />
        </div>
    );
}

export default ShareActivity;