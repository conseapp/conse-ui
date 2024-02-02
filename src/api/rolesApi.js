import axios from 'axios'

const roleApi = axios.create({
    baseURL: 'http://5.34.196.146:3455'
})



export const getRoleImg = async (reqInfo) => {
    const { token, roleId, gameId } = reqInfo

    const response = await roleApi.get(`/roles/${gameId}/${roleId}`, {
        headers: {
            'token': `Bearer ${token}`,
        },
        responseType: 'blob'
    })

    if (response.status == 200)
        return (response.data)
    if (response.status == 404)
        return (null)
}

export const getCardImg = async (reqInfo) => {
    const { token, cardId} = reqInfo

    const response = await roleApi.get(`/cards/${cardId}`, {
        headers: {
            'token': `Bearer ${token}`,
        },
        responseType: 'blob'
    })

    if (response.status == 200)
        return (response.data)
    if (response.status == 404)
        return (null)
}

