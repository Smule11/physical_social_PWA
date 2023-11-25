import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig'; // Adjust the import path as necessary
import BannerAd from '../components/BannerAd';
import NavBar from '../components/NavBar';

const Ladder = () => {
    const [activityLogs, setActivityLogs] = useState([]);

    useEffect(() => {
        const fetchActivityLogs = async () => {
            const user = auth.currentUser;
            if (user) {
                // this query line is probably wrong, as the where userID == user.uid is from an old version, but I'm new to JS and firebase etc.
                const q = query(collection(db, `users/${user.uid}/activityLog`), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const logs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().toString() : 'No timestamp'
                }));
                setActivityLogs(logs);
            }
        };

        fetchActivityLogs();
    }, []);

    return (
        <div className="ladder-container">
            <BannerAd />
            <h2>Ladder</h2>

            {/* Display the activity name and timestamp */}
            <ul>
                {activityLogs.map((log, index) => (
                    <li key={index}>
                        Activity: {log.activityName}, Time: {log.timestamp}
                    </li>
                ))}
            </ul>

            <NavBar selected="ladder" />
        </div>
    );
}

export default Ladder;