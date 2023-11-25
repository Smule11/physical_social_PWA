/*
This service will interact directly with Firebase Firestore
 to handle the operations for activities.
*/

import firebase from './firebaseConfig';

const db = firebase.firestore();
const activityCollection = db.collection("activities");

export const createActivity = async (activity) => {
    try {
        const docRef = await activityCollection.add(activity);
        return docRef.id;  // return the ID of the new activity
    } catch (error) {
        console.error("Error adding activity: ", error);
    }
}

export const getActivity = async (activityId) => {
    try {
        const doc = await activityCollection.doc(activityId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            console.log("No such activity!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching activity: ", error);
    }
}

export const updateActivity = async (activityId, updatedData) => {
    try {
        await activityCollection.doc(activityId).update(updatedData);
    } catch (error) {
        console.error("Error updating activity: ", error);
    }
}

export const deleteActivity = async (activityId) => {
    try {
        await activityCollection.doc(activityId).delete();
    } catch (error) {
        console.error("Error deleting activity: ", error);
    }
}

export const getAllActivitiesForUser = async (userId) => {
    try {
        const snapshot = await activityCollection.where("userId", "==", userId).get();
        let activities = [];
        snapshot.forEach(doc => {
            activities.push({ id: doc.id, ...doc.data() });
        });
        return activities;
    } catch (error) {
        console.error("Error fetching activities: ", error);
    }
}