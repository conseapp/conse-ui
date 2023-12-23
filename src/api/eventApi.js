import axios from 'axios'

const authApi = axios.create({
    baseURL: 'https://api.mafia.conse.app/event'
})


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


export const uploadEventImg = async (reqInfo) => {

    const { token, eventId, fd } = reqInfo

    const response = await authApi.post(`/update/${eventId}/image`, fd, {
        headers: {
            'Authorization': `Bearer ${token}`,
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



