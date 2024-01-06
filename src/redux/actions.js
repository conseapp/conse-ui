import { checkToken } from '../api/authApi'
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_PHASE_STATE = 'UPDATE_PHASE_STATE'
export const RESET_PHASE_STATE = 'RESET_PHASE_STATE'
export const UPDATE_TIME = 'UPDATE_TIME'


const emptyUser = {
    id: undefined,
    isLoggedIn: false,
    username: "",
    phone: "",
    accessLevel: undefined,
    accessToken: '',
    avatarPath: '',
}

const emptyPhaseState = {
    day: [],
    mid_day: [],
    night: []
};


export const getuser = (token) => {
    try {
        return async dispatch => {
            console.log(token);
            const response = await checkToken(token)
            console.log(response);

            if (response.status >= 200 && response.status < 300) {
                let userDetails = {
                    id: response.data._id.$oid,
                    isLoggedIn: true,
                    username: response.data.username,
                    phone: response.data.phone,
                    accessLevel: response.data.access_level,
                    accessToken: token,
                    avatarPath: response.data.avatar_path,
                }
                console.log(response.data.avatar_path);

                dispatch({
                    type: GET_USER,
                    payload: userDetails
                });
            } else {
                dispatch({
                    type: GET_USER,
                    payload: emptyUser
                });
            }
        };
    } catch (error) {
        console.log(error);
    }
};

export const logout = () => {
    localStorage.clear()
    return async dispatch => {
        dispatch({
            type: LOGOUT_USER,
            payload: emptyUser
        });
    }
}


export const updatePhaseState = (time, user, newData, dataType) => {
    return async dispatch => {
        dispatch({
            type: UPDATE_PHASE_STATE,
            payload: { time, user, dataType, newData }
        });
    }
};
export const resetPhaseState = () => {
    return async dispatch => {
        dispatch({
            type: RESET_PHASE_STATE,
            payload: emptyPhaseState
        });
    }
};

export const updateTime = time => ({
    type: UPDATE_TIME,
    payload: time
});