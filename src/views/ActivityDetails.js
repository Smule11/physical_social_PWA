import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
        fetchActivities();
    }, []);

    // Add a custom activity for the current user's specific sub-collection
    const handleAddCustomActivity = async () => {
        const user = auth.currentUser;
        if (user && customActivity) {
            const activityNameLower = customActivity.toLowerCase();
            const isDuplicate = activities.includes(activityNameLower); // Check if the activity name is already in the list
    
            if (isDuplicate) {
                setError('This activity already exists.');
                return;
            }
    
            setError('');
            const activityDocRef = doc(db, `users/${user.uid}/activitiesList`, activityNameLower); // Use the name as the document ID
            try {
                await setDoc(activityDocRef, { color: "defaultColor" }); // Set the color as the document's field
                fetchActivities(); // Refetch activities
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
            const activityLogRef = doc(collection(db, `users/${user.uid}/activityLog`));
            try {
                await setDoc(activityLogRef, {
                    activityName: category,
                    details: details,
                    startTime: serverTimestamp(), // Logs the time the document was created
                    // endTime: endTime, // Uncomment and set this when you have an end time
                    userId: user.uid // Store user's UID if needed for reference
                });
                navigate('/'); // Navigate back to home page
            } catch (error) {
                console.error("Failed to log activity for user:", user.uid, error);
            }
        } else {
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
                Log Activity
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ActivityDetails;