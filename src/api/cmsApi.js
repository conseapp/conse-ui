import axios from 'axios'

const cmsApi = axios.create({
    baseURL: 'https://cms.api.jamshid.app/blog'
})


export const getAllPosts = async () => {
    const response = await cmsApi.get(`/posts`)

    if (response.status == 200)
        return (response.data)
    if (response.status == 404)
        return (null)
}

export const getSinglePost = async (slug) => {
    const response = await cmsApi.get(`/post/${slug}`)

    if (response.status == 200)
        return (response.data)
    if (response.status == 404)
        return (null)
}

export const getSinglePostComments = async (slug) => {
    const response = await cmsApi.get(`/post/${slug}/comments`)


    if (response.status == 200)
        return (response.data)
    if (response.status == 404)
        return (null)
}

export const addPostComment = async (reqInfo) => {
    const { token, slug, content, author } = reqInfo

    const body = {
        body: content,
        author: author
    }

    const response = await cmsApi.post(`/post/${slug}/comments/`, body, {
        headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })


    if (response.status !== 201)
        throw new Error(`${response.data.message} ${response.data.status}`)

    return response.data
}

