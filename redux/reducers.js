import { GET_USER } from './actions';
import { LOGOUT_USER } from './actions';
import { UPDATE_PHASE_STATE, SET_TIME } from './actions';

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
                globalUser: action.payload
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
                globalUser: action.payload
            };
        default:
            return state;
    }
}



const initialPhaseState = {
    day: [],
    mid_day: [],
    night: []
};

const initialTimeState = {
    selectedTime: 'day'
};

const phaseReducer = (state = initialPhaseState, action) => {
    switch (action.type) {

        case UPDATE_PHASE_STATE:
            const { time, user, dataType, newData } = action.payload;
            const updatedTime = [...state[time]];
            const userIndex = updatedTime.findIndex(u => u.user_id === user.user_id);

            if (userIndex !== -1) {
                const updatedUser = { ...updatedTime[userIndex] };

                if (dataType === 'chain') {
                    updatedUser.chain_history = [...updatedUser.chain_history, newData];
                } else if (dataType === 'ability') {
                    updatedUser.role_ability_history = [...updatedUser.role_ability_history, newData];
                }
                updatedTime[userIndex] = updatedUser;
            } else {
                const newUser = {
                    ...user,
                    chain_history: dataType === 'chain' ? [newData] : [],
                    role_ability_history: dataType === 'ability' ? [newData] : []
                };

                updatedTime.push(newUser);
            }
            return { ...state, [time]: updatedTime };
        default:
            return state;
    }
};

const timeReducer = (state = initialTimeState, action) => {
    switch (action.type) {
        case SET_TIME:
            return { ...state, selectedTime: action.payload };
        default:
            return state;
    }
};



export default userReducer;
export { phaseReducer, timeReducer };



// chain history
// {
//     to_id: "0",
//     chained_at: undefined
// },

// role ability
// {
//     role_id: "",
//     current_ability: 3,
//     updated_at: undefined
// }