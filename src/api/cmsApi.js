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

