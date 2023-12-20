import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import BannerAd from '../components/BannerAd';
import NavBar from '../components/NavBar';

const Ladder = () => {
    const [activitiesByDate, setActivitiesByDate] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadTime, setLoadTime] = useState(0);

    useEffect(() => {
        const startTime = Date.now(); // Start the timer

        const fetchActivityLogs = async () => {
            const user = auth.currentUser;
            if (user) {
                // Mock data for testing
                const mockData = {
                    // Date format: YYYY-MM-DD
                    '2023-12-10': [{ id: '10:00_Activity 1', startTime: '10:00', activityName: 'Activity 1' }],
                    '2023-12-11': [{ id: '11:00_Activity 2', startTime: '11:00', activityName: 'Activity 2' }],
                    '2023-12-12': [{ id: '12:00_Activity 3', startTime: '12:00', activityName: 'Activity 3' }],
                    '2023-12-13': [{ id: '13:00_Activity 4', startTime: '13:00', activityName: 'Activity 4' }],
                    // Add more mock data as needed
                };

                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 7); // 7 days ago
                const dates = [];
                for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
                    dates.push(d.toISOString().split('T')[0]);
                }
    
                const fetchPromises = dates.map(date => {
                    const logsCollectionRef = collection(db, `users/${user.uid}/${date}`);
                    return getDocs(logsCollectionRef);
                    // return Promise.resolve({ docs: mockData[date] || [] });
                });
    
                Promise.all(fetchPromises).then(querySnapshots => {
                    let logs = {};
                    querySnapshots.forEach((querySnapshot, index) => {
                        const date = dates[index];
                        logs[date] = querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            time: doc.id.split('_')[0],
                            activityName: doc.id.split('_')[1]
                        }));
                    });
                    setActivitiesByDate(logs);
                    setLoading(false);
                    setLoadTime(Date.now() - startTime);
                });
            } else {
                setLoading(false);
                setLoadTime(Date.now() - startTime);
            }
        };
    
        fetchActivityLogs();
    }, []);

    return (
        <div>
            <BannerAd />
            <div className="home-container">
                <h2>Ladder</h2>
                {loading ? (
                    <div>Loading activities...</div>
                ) : (
                    Object.keys(activitiesByDate)
                        .filter(date => activitiesByDate[date].length > 0) // Filter out empty dates
                        .sort((a, b) => new Date(b) - new Date(a)) // Sort dates in descending order
                        .map((date) => (
                            <div key={date}>
                                <h3>{date}</h3>
                                <ul>
                                    {activitiesByDate[date].map((log, index) => (
                                        <li key={index}>
                                            {log.time}: {log.activityName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                )}
                <div>Page load time: {loadTime} ms</div>
                <NavBar selected="ladder" />
            </div>
        </div>
    );
}

export default Ladder;