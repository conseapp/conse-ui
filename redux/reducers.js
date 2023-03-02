import { GET_USER } from './actions';
import { LOGOUT_USER } from './actions';
const initialState = {
    email: '',
    image_url: '',
    phone_number: '',
    access_level: '',
    user_id: undefined,
    user_points: undefined,
    username: '',
    accessToken: '',
    isLoggedIn: false,
    first_name: '',
    last_name: '',
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER:
            return {
                ...state,
                // userDetails: action.payload,
                user_id: action.payload.user_id,
                username: action.payload.username,
                access_level: action.payload.access_level,
                phone_number: action.payload.phone_number,
                isLoggedIn: action.payload.isLoggedIn,
                accessToken: action.payload.accessToken,
                globalUser:action.payload
            };
        case LOGOUT_USER:
            return {
                ...state,
                // userDetails: action.payload,
                user_id: action.payload.user_id,
                username: action.payload.username,
                access_level: action.payload.access_level,
                phone_number: action.payload.phone_number,
                isLoggedIn: false,
                globalUser:action.payload
            };
        default:
            return state;
    }
}

export default userReducer;