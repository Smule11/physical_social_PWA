import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import NavBar from '../components/NavBar';
import './Home.css';
import { db, auth } from '../services/firebaseConfig';
import { collection, onSnapshot, getDoc, updateDoc, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

function Home() {
    let navigate = useNavigate();
    const [currentActivity, setCurrentActivity] = useState(null);
    const [timer, setTimer] = useState("00:00");

    // Fetching the current activity from Firestore
    useEffect(() => {
        let isMounted = true;
        // Check if user is logged in
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;

            // Reference to the current activity document
            const currentActivityDocRef = doc(db, 'users', userId, 'currentActivity', 'current'); // 'current' is a static ID for the currentActivity document

            // Initialize current activity with null values if it doesn't exist
            getDoc(currentActivityDocRef).then((docSnapshot) => {
                if (!docSnapshot.exists()) {
                    setDoc(currentActivityDocRef, {
                        name: null,
                        startTime: null, // Use Firestore timestamp for consistency
                        // ... any other fields you need
                    });
                }
            });

            const unsubscribe = onSnapshot(currentActivityDocRef, (docSnapshot) => {
                if (isMounted) {
                    const activityData = docSnapshot.data();
                    if (activityData) {
                        setCurrentActivity(activityData);
                        // Start the timer based on activityData.startTime, if the activity name is not null
                        if (activityData.name && activityData.startTime) {
                            startTimer(activityData.startTime.toDate());
                        } else {
                            setTimer("00:00");
                            clearInterval(timerInterval); // Ensure to clear any running timer
                        }
                    } else {
                        setCurrentActivity({ name: null, startTime: null });
                        setTimer("00:00");
                        clearInterval(timerInterval); // Ensure to clear any running timer
                    }
                }
            });

            return () => {
                isMounted = false;
                unsubscribe();
                clearInterval(timerInterval); // Cleanup on unmount
            };
        }
    }, []);

    let timerInterval; // Define timer interval outside useEffect

    function startTimer(startTime) {
        timerInterval = setInterval(() => {
            const now = new Date();
            const elapsed = new Date(now - startTime); // Calculate elapsed time
            const minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
            const seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');
            setTimer(`${minutes}:${seconds}`);
        }, 1000);
    }


    function handleActivityClick() {
        // Logic to end the current activity
        // Update Firestore currentActivity to null
        // Optionally update activityLog with end time
        if (currentActivity && currentActivity.name && currentActivity.startTime) {
            // Logic to end the current activity
            const userId = auth.currentUser.uid;
            // console log the proposed path
            console.log('users/' + userId + '/currentActivity/current');
            const currentActivityRef = doc(db, 'users', userId, 'currentActivity', 'current'); // Use the static ID for the currentActivity document
            // const currentActivityRef = doc(db, 'users', userId, 'currentActivity', currentActivity.id); // Assuming each currentActivity has an ID

            // Set currentActivity name to null in Firestore to indicate activity has ended
            updateDoc(currentActivityRef, { 
                name: null,
                startTime: null
            })
            .then(() => {
    
                const serverDate = currentActivity.startTime.toDate(); // Convert the Firestore timestamp to a JavaScript Date object
                // const formattedDate = serverDate.toISOString().replace('T', ' ').split('.')[0]; // Format the date as YYYY-MM-DD HH:MM:SS
                const formattedDate = serverDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
                const formattedTime = serverDate.toISOString().split('T')[1].split('.')[0]; // Format the time as HH:MM:SS
                const activityLogName = formattedTime + "_" + currentActivity.name;

                console.log("Adding end time to activity log:", activityLogName)
                const activityLogRef = doc(collection(db, 'users', userId, formattedDate), activityLogName); // Assuming a reference to the log ID
                updateDoc(activityLogRef, {
                    endTime: serverTimestamp() // Set end time to current server time
                });

                console.log("Current activity ended");
                setCurrentActivity({ ...currentActivity, name: null, startTime: null }); // Update the local state to reflect no active activity
                setTimer("00:00");
            })
            .catch(error => {
                console.error("Error ending activity:", error);
            });
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
        <div className="home-container">
            <h2>Home</h2>
            <div class="bigButton-container">
                <Button 
                    onClick={handleActivityClick} 
                    className="bigButton" 
                    label={currentActivity && currentActivity.name ? "Finish Activity" : "Start Activity"} 
                />
            </div>
            <div className="activity-name">{currentActivity && currentActivity.name ? `${currentActivity.name}` : "Just Chilling"}</div>
            <div className="digital-clock">{timer}</div>
            <NavBar />
        </div>
    );
}

export default Home;