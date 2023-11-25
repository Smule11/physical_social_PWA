class Activity {
    constructor(activityId, userId, category, detail, startTime, endTime) {
        this.activityId = activityId;  // Unique ID for the activity
        this.userId = userId;          // User ID of the owner of the activity
        this.category = category;      // Category of the activity
        this.detail = detail;          // Detailed description or extra info
        this.startTime = startTime;    // Start time of the activity
        this.endTime = endTime;        // End time of the activity
    }

    // Duration of the activity
    get duration() {
        return this.endTime - this.startTime;
    }

    // Update details of the activity
    updateDetail(newDetail) {
        this.detail = newDetail;
    }

    // Update category of the activity
    updateCategory(newCategory) {
        this.category = newCategory;
    }

    // Other methods to manipulate activity data can be added here
}

export default Activity;