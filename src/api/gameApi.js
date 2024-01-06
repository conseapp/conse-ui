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

export const getSides = async (token) => {
    const response = await authApi.get("/side/get/availables", {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (response.data.status == 200)
        return (response.data)
    if (response.data.status == 404)
        return ([])
}

export const getRoles = async (token) => {
    const response = await authApi.get("/role/get/availables", {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (response.data.status == 200)
        return (response.data)
    if (response.data.status == 404)
        return ([])
}

export const getCards = async (token) => {
    const response = await authApi.get("/last-move/get/availables", {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (response.data.status == 200)
        return (response.data)
    if (response.data.status == 404)
        return ([])
}

export const getSingleDeck = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post(`/deck/get/single`, body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data

}

export const upsertDeck = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post(`/deck/add`, body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 201 && response.data.status !== 302)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data

}

export const getSinglePlayer = async (reqInfo) => {
    const { token, body } = reqInfo
    const response = await authApi.post(`/player/get/single`, body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data

}

export const getRoleAbility = async (reqInfo) => {
    const { token, body } = reqInfo

    const response = await authApi.post("/player/get/role-ability", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data


}

export const getChainInfo = async (reqInfo) => {
    const { token, body } = reqInfo

    const response = await authApi.post("/player/get/chain-infos", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    if (response.data.status !== 200)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data


}

export const updatePlayerStatus = async (reqInfo) => {
    const { token, body } = reqInfo

    const response = await authApi.post("/player/update/status", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    return response.data

}

export const updatePlayerSide = async (reqInfo) => {
    const { token, body } = reqInfo

    const response = await authApi.post("/player/update/side", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    return response.data

}

export const updatePlayerRole = async (reqInfo) => {
    const { token, body } = reqInfo

    const response = await authApi.post("/player/update/role", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    return response.data

}
export const chainPlayer = async (reqInfo) => {
    const { token, body } = reqInfo

    const response = await authApi.post("/player/chain", body, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    return response.data

}

