import axios from 'axios';
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const TIMER = 'TIMER'
export const UPDATE_PHASE_STATE = 'UPDATE_PHASE_STATE'
export const RESET_PHASE_STATE = 'RESET_PHASE_STATE'
export const UPDATE_TIME = 'UPDATE_TIME'


const emptyUser = {
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

const emptyPhaseState = {
    day: [],
    mid_day: [],
    night: []
};


export const getuser = () => {
    let response;
    let _response;
    if (typeof window !== 'undefined') {
        response = localStorage.getItem("loginresp")
        console.log("response", response)
        _response = JSON.parse(response)
        console.log("_response", _response)
    }
    if (response != undefined || response != null && _response != undefined || _response != null) {
        try {
            return async dispatch => {
                let userDetails = {}
                if (_response.status >= 200 && _response.status < 300) {
                    userDetails.user_id = _response.data._id.$oid
                    userDetails.isLoggedIn = true
                    userDetails.username = _response.data.username
                    userDetails.access_level = _response.data.access_level
                    userDetails.accessToken = _response.data.access_token
                    userDetails.phone_number = _response.data.phone
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
            // Add custom logic to handle errors
            console.log(error);
        }
    }
    else return async dispatch => {
        dispatch({
            type: GET_USER,
            payload: emptyUser
        });
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

export const timer = (time) => {
    return async dispatch => {
        dispatch({
            type: TIMER,
            payload: time
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