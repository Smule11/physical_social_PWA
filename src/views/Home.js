import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import NavBar from '../components/NavBar';
import { auth, db } from '../services/firebaseConfig'; // Import Firestore database
import { collection, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

function Home() {
    let navigate = useNavigate();
    const [currentActivity, setCurrentActivity] = useState(null);
    const [timer, setTimer] = useState("00:00");

    // Fetching the current activity from Firestore
    useEffect(() => {
        const user = auth.currentUser;
        // Assuming 'USER_ID' is replaced with the actual user ID
        const userCollectionRef = collection(db, 'users', user.uid, 'currentActivity');
        
        const unsubscribe = onSnapshot(userCollectionRef, snapshot => {
            if (!snapshot.empty) {
                const activityData = snapshot.docs[0].data();
                setCurrentActivity(activityData);
                // Start timer based on activityData.startTime
            } else {
                setCurrentActivity(null);
                setTimer("00:00");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    function handleActivityClick() {
        if (currentActivity) {
            // Logic to end the current activity
            // Update Firestore currentActivity to null
            // Optionally update activityLog with end time
        } else {
            // Navigate to the ActivityDetails page
            navigate('/activity-details');
        }
    }

    // Timer logic (for demonstration)
    // In a real app, you would implement a more robust timer logic
    useEffect(() => {
        if (currentActivity) {
            const interval = setInterval(() => {
                // Update timer based on currentActivity.startTime
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentActivity]);

    return (
        <div>
            <h2>Home</h2>
            <Button 
                onClick={handleActivityClick} 
                className="bigButton" 
                label={currentActivity ? "Finish Activity" : "Start Activity"} 
            />
            <div>{currentActivity ? `Current Activity: ${currentActivity.name}` : "Just Chilling"}</div>
            <div>Timer: {timer}</div>
            <NavBar />
        </div>
    );
}

export default Home;