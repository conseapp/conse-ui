import axios from 'axios'

const roleApi = axios.create({
    baseURL: 'https://roles.api.jamshid.app'
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

