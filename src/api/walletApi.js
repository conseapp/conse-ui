import axios from 'axios'


export const getUserBalance = async (reqInfo) => {
    const { token, userID } = reqInfo

    const response = await axios.post(`http://5.34.196.146:3622/api/getbalance/`, null, {
        params: {
            user_id: userID
        },

        headers: {
            'token': `Bearer ${token}`,
        },
    })

    return (response)
}

export const Deposit = async (reqInfo) => {
    const { token, userID, amount } = reqInfo

    const response = await axios.post(`http://5.34.196.146:3622/api/deposit/`, null, {
        params: {
            user_id: userID,
            amount: amount
        },

        headers: {
            'token': `Bearer ${token}`,
        },
    })

    return (response)
}

export const purchaseEvent = async (reqInfo) => {
    const { token, userID, amount, eventID } = reqInfo

    const response = await axios.post(`http://5.34.196.146:3622/api/purchase/`, null, {
        params: {
            user_id: userID,
            amount: amount,
            event_id: eventID
        },

        headers: {
            'token': `Bearer ${token}`,
        },
    })

    return (response)
}


// PURCHASE EVENT
// http://5.34.196.146:3622/api/purchase/?user_id=<user_id>&amount=<amount>&event_id=<event_id>