import axios from 'axios'

const walletApi = axios.create({
    baseURL: 'https://wallet.jamshid.app'
})

export const getUserBalance = async (reqInfo) => {
    const { token, userID } = reqInfo

    const response = await walletApi.post(`/api/getbalance/`, null, {
        params: {
            user_id: userID
        },

        headers: {
            'token': `Bearer ${token}`,
        },
    })

    return (response)
}

export const purchaseEvent = async (reqInfo) => {
    const { token, userID, amount, eventID } = reqInfo

    const response = await walletApi.post(`/api/purchase/`, null, {
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

export const paymentRequest = async (reqInfo) => {
    const { token, userID, eventID, amount, phone, type } = reqInfo

    const body = {
        amount: amount,
        description: 'Jamshid Payment Request',
        phone: phone,
        type: type,
        user_id: userID,
        event_id: eventID
    }

    const response = await walletApi.post(`/zarinpal/request/`, body, {
        headers: {
            'token': `Bearer ${token}`,
        },
    })

    if (response.status !== 200)
        throw new Error(`${response.status} ${response.data}`)

    return response.data
}

