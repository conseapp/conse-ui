import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://5.34.196.146:7438/auth'
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


