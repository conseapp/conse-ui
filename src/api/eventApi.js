import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://5.34.196.146:7438/event'
})


export const search = async (value) => {
    const response = await authApi.get(`/explore/${value}`)

    if (response.data.status == 200)
        return (response.data)
    if (response.data.status == 404)
        return ([])
}

export const getEvents = async () => {
    const response = await authApi.get("/get/all")

    if (response.data.status == 200)
        return (response.data)
    if (response.data.status == 404)
        return ([])
}

export const getPlayerIngoingEvents = async (token) => {

    const response = await authApi.post(`/get/all/player/in-going`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}

export const getPlayerExpiredEvents = async (token) => {

    const response = await authApi.post(`/get/all/player/done`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}

export const getGodEvents = async (token) => {
    const response = await authApi.get("/get/all/god", {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status == 200)
        return (response.data)
    if (response.data.status == 404)
        return ([])
}

export const getSingleEvent = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post(`/get/single`, body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data

}

export const getSingleGodEvent = async (reqInfo) => {
    const { token, eventId } = reqInfo
    const response = await authApi.post(`/get/single/${eventId}/god`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data

}

export const createEvent = async (reqInfo) => {

    const { token, body } = reqInfo

    const response = await authApi.post("/add", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200 && response.data.status !== 201 && response.data.status !== 302)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}


export const reserveEvent = async (reqInfo) => {

    const { token, body } = reqInfo

    const response = await authApi.post("/reserve/mock", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })


    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}

export const revealRoles = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post("/reveal/roles", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}

export const lockEvent = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post("/set-lock", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}


export const expireEvent = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post("/set-expire", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}

export const addPhase = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post("/update/phases/add", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}



