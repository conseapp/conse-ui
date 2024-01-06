import { GET_USER } from './actions';
import { LOGOUT_USER } from './actions';
import { UPDATE_PHASE_STATE, RESET_PHASE_STATE, UPDATE_TIME } from './actions';

const initialState = {
    id: undefined,
    isLoggedIn: false,
    username: "",
    phone: "",
    accessLevel: undefined,
    accessToken: '',
    avatarPath: '',
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER:
            return {
                id: action.payload.id,
                isLoggedIn: action.payload.isLoggedIn,
                username: action.payload.username,
                phone: action.payload.phone,
                accessLevel: action.payload.accessLevel,
                accessToken: action.payload.accessToken,
                avatarPath: action.payload.avatarPath
            };
        case LOGOUT_USER:
            return {
                id: action.payload.id,
                isLoggedIn: action.payload.isLoggedIn,
                username: action.payload.username,
                phone: action.payload.phone,
                accessLevel: action.payload.accessLevel,
                accessToken: action.payload.accessToken,
                avatarPath: action.payload.avatarPath,
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

        case RESET_PHASE_STATE:
            return { ...action.payload }
        default:
            return state;
    }
};

const initialTimeState = {
    selectedTime: 'day'
};

const timeReducer = (state = initialTimeState, action) => {
    switch (action.type) {
        case UPDATE_TIME:
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