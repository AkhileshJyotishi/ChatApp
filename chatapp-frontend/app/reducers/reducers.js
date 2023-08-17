export const initialstate = {
  Friends: [],
  pendingfriendinvitations: [],
  onlineusers: [],
};

 const friendactions = {
  Set_Friends: "Friends.Set_Friends",
  Set_Pending_friend_invitations: "Friends.Set_Pending_friend_invitations",
  Set_Online_Users: "Friends.Set_Online_Users",
};

export const reducer = (state = initialstate, action) => {
  switch (action.type) {
    case friendactions.Set_Pending_friend_invitations: {
      return {
        ...state,
        pendingfriendinvitations: action.pendingfriendinvitations,
      };
    }
    case friendactions.Set_Friends: {
      return {
        ...state,
        Friends: action.friends,
      };
    }
    case friendactions.Set_Online_Users: {
      return {
        ...state,
        onlineusers: action.onlineusers,
      };
    }

    default:
      return state;
  }
};
