import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { collection, getDocs, getDoc, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import BannerAd from '../components/BannerAd';
import './ActivityDetails.css';

const ActivityDetails = () => {
    const [category, setCategory] = useState('');
    const [customActivity, setCustomActivity] = useState('');
    const [details, setDetails] = useState('');
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    // Fetch activities from Firestore specific to the user
    const fetchActivities = async () => {
        const user = auth.currentUser;
        if (user) {
            const activitiesRef = collection(db, `users/${user.uid}/activitiesList`);
            try {
                const activitiesSnapshot = await getDocs(activitiesRef);
                const activitiesNames = activitiesSnapshot.docs.map(doc => doc.id); // Use the document ID as the activity name
                setActivities(activitiesNames);
            } catch (error) {
                console.error("Failed to fetch activities for user:", user.uid, error);
            }
        }
    };

    useEffect(() => {
        let isMounted = true; // flag to track if the component is mounted
    
        const fetchData = async () => {
            if (isMounted) {
                await fetchActivities();
            }
        };
    
        fetchData();
    
        // Cleanup function
        return () => {
            isMounted = false; // set the flag to false when the component unmounts
        };
    }, []);

    // Add a custom activity for the current user's specific sub-collection
    const handleAddCustomActivity = async () => {
        const user = auth.currentUser;
        if (user && customActivity) {
            const activityNameLower = customActivity.toLowerCase();
            const isDuplicate = activities.includes(activityNameLower); // Check if the activity name is already in the list
    
            if (isDuplicate) {
                console.log("This activity already exists.");
                setError('This activity already exists.');
                return;
            }
    
            setError('');
            const activityDocRef = doc(db, `users/${user.uid}/activitiesList`, activityNameLower); // Use the name as the document ID
            console.log("Adding custom activity:", activityNameLower);

            try {
                await setDoc(activityDocRef, { color: "defaultColor" }); // Set the color as the document's field
                fetchActivities(); // Refetch activities
                setCategory(activityNameLower);
            } catch (error) {
                console.error("Failed to add custom activity for user:", user.uid, error);
            }
        } else {
            setError('Please enter a custom activity name or sign in');
        }
    };

    // Log the activity
    const handleLogActivity = async () => {
        const user = auth.currentUser;
        if (user && category) {
            // Use the static ID for the currentActivity document
            const currentActivityRef = doc(db, 'users', user.uid, 'currentActivity', 'current');
            
            try {
                // Set the current activity
                await setDoc(currentActivityRef, {
                    name: category,
                    startTime: serverTimestamp(), // Logs the time the document was created
                });

                // Read back the document to get the actual timestamp
                const docSnap = await getDoc(currentActivityRef);
                if (docSnap.exists() && docSnap.data().startTime) {
                    const serverDate = docSnap.data().startTime.toDate(); // Convert the Firestore timestamp to a JavaScript Date object
                    // const formattedDate = serverDate.toISOString().replace('T', ' ').split('.')[0]; // Format the date as YYYY-MM-DD HH:MM:SS
                    const formattedDate = serverDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
                    const formattedTime = serverDate.toISOString().split('T')[1].split('.')[0]; // Format the time as HH:MM:SS
                    const activityLogName = formattedTime + "_" + category;
                    const formattedDateString = serverDate.toString(); // Show the full object
                    console.log("startTime serverDate:", formattedDateString);

                    // Create a new activity log entry using the formattedDate
                    // const activityLogRef = doc(db, `users/${user.uid}/activityLog`, formattedDate);
                    // actually, store the activity log doc inside a subcollection named after the formatted date
                    const activityLogRef = doc(collection(db, `users/${user.uid}/`, formattedDate), activityLogName);
                    // Add the new activity log entry
                    await setDoc(activityLogRef, {
                        activityName: category,
                        details: details,
                        startTime: serverTimestamp(), // Logs the time the document was created
                        // endTime: endTime, // Uncomment and set this when you have an end time
                        userId: user.uid // Store user's UID if needed for reference
                    });

                    navigate('/'); // Navigate back to home page

                } else {
                    console.error("Failed to get the server timestamp.");
                }
            } catch (error) {
                console.error("Failed to log activity or set current activity for user:", user.uid, error);
            }
        } else {
            // Handle the error case where category is not selected or user is not signed in
            setError('Please select an activity or sign in');
        }
    };

    return (
        <div className="centered-content">
            <BannerAd className="banner-ad" />
            <h2>Activity Details</h2>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="component">
                <option value="" disabled>Select an activity...</option>
                {activities.map((activityName, index) => (
                    <option key={index} value={activityName}>{activityName}</option>
                ))}
            </select>
            <input
                placeholder="Enter custom activity name"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                className="component"
            />
            <button onClick={handleAddCustomActivity} className="button">
                + Add Custom Activity
            </button>
            <textarea
                placeholder="Details about the activity..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="component"
            />
            {category && <span className="selected-activity-message">Selected activity: {category}</span>}
            <button onClick={handleLogActivity} className="button">
                Start Activity
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ActivityDetails;