import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  MARK_NOTIFICATIONS_READ,
  SET_USERS
} from "../types";
import user from "../../pages/user";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
  users: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
        users: [...state.users]
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            screamId: action.payload.screamId
          }
        ]
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          like => like.screamId !== action.payload.screamId
        )
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach(not => (not.read = true));
      return {
        ...state
      };
    case SET_USERS:
      let users = [];
      action.payload.forEach(handle => {
        users.push(handle);
      });
      return {
        ...state,
        users
      };
    default:
      return state;
  }
}
