import axios from 'axios'

const adminApi = axios.create({
    baseURL: 'https://panel.api.conse.app/admin'
})




export const uploadEventImg = async (reqInfo) => {

    const { token, eventId, fd } = reqInfo

    const response = await adminApi.post(`/event/${eventId}/upload/img`, fd, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })


    if (response.data.status !== 200 && response.data.status !== 201 && response.data.status !== 302)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}