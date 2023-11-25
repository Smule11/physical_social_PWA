class FriendGroup {
    constructor(groupId, groupName, memberIds = []) {
        this.groupId = groupId;        // Unique ID for the friend group
        this.groupName = groupName;    // Name of the friend group
        this.memberIds = memberIds;    // Array of UIDs of members in this group
    }

    // Add a member by UID
    addMember(uid) {
        if (!this.memberIds.includes(uid)) {
            this.memberIds.push(uid);
        }
    }

    // Remove a member by UID
    removeMember(uid) {
        this.memberIds = this.memberIds.filter(memberId => memberId !== uid);
    }

    // Rename the group
    renameGroup(newName) {
        this.groupName = newName;
    }

    // Other methods to manipulate friend group data can be added here
}

export default FriendGroup;