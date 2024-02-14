import axios from 'axios'

const logoutApi = axios.create({
    baseURL: 'https://logout.api.jamshid.app'
})

export const logoutUser = async (reqInfo) => {
    const { token, userID } = reqInfo

    const response = await logoutApi.post(`/logout`, null, {
        params: {
            user_id: userID
        },

        headers: {
            'token': `Bearer ${token}`,
        },
    })

    return (response)
}
