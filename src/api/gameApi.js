import axios from 'axios'

const authApi = axios.create({
    baseURL: 'https://api.mafia.conse.app/game'
})


export const getGodGroups = async (token, userId) => {
    const body = {
        _id: userId
    }
    const response = await authApi.post("/god/get/group/all", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })


    return response.data
}

export const createGroup = async ({ token, name, owner, god_id }) => {
    const body = {
        name: name,
        owner: owner,
        god_id: god_id,
    }
    const response = await authApi.post("/god/create/group", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200 && response.data.status !== 201)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}