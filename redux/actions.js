import axios from 'axios';
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const TIMER = 'TIMER'


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
export const getuser = () => {
    const response = localStorage.getItem("loginresp")
    console.log("response", response)
    const _response = JSON.parse(response)
    console.log("_response", _response)
    if (response != undefined || response != null && _response != undefined || _response != null) {
        try {
            return async dispatch => {
                let userDetails = {}
                if (_response.status >= 200 && _response.status < 300) {
                    userDetails.user_id = _response.data._id.$oid
                    userDetails.isLoggedIn = true
                    userDetails.username = _response.data.username
                    userDetails.access_level = _response.data.access_level
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