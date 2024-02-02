import axios from 'axios'

const adminApi = axios.create({
    baseURL: 'http://5.34.196.146:7442'
})




export const uploadEventImg = async (reqInfo) => {

    const { token, eventId, fd } = reqInfo

    const response = await adminApi.post(`/admin/mafia/event/${eventId}/upload/img`, fd, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })


    if (response.data.status !== 200 && response.data.status !== 201 && response.data.status !== 302)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}

export const uploadAvatarImg = async (reqInfo) => {

    const { token, userId, fd } = reqInfo

    const response = await adminApi.post(`/user/mafia/player/${userId}/upload/avatar`, fd, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })


    if (response.data.status !== 200 && response.data.status !== 201 && response.data.status !== 302)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}