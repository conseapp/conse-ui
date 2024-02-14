import axios from 'axios'

const authApi = axios.create({
    baseURL: 'https://api.mafia.jamshid.app/auth'
})

export const requestOTP = async (body) => {
    const response = await authApi.post("/otp-req", body)

    return response.data
}

export const checkOTP = async (body) => {
    const response = await authApi.post("/check-otp", body)

    return response.data
}

export const checkToken = async (token) => {
    const response = await authApi.post("/check-token", null, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    return response.data
}

export const loginUser = async (body) => {
    const response = await authApi.post("/login", body)

    return response.data
}

export const getAllUsers = async (token) => {
    const response = await authApi.post("/user/get/all", null, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    return response.data
}

export const editProfile = async (reqInfo) => {
    const { token, username, phone } = reqInfo

    const body = {
        username: username,
        phone: phone
    }

    const response = await authApi.post("/edit-profile", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return (response.data)
}

export const RegisterNewGod = async (reqInfo) => {
    const { token, id } = reqInfo

    const body = {
        _id: id,
    }

    const response = await authApi.post("/signup/new-god", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return (response.data)
}


