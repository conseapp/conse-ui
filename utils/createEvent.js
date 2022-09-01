import { getCookie } from "cookies-next";

const CreateEvent = async ( body, token ) => {
    const headers = {
        'Authorization': `Bearer ${ token }`,
        'Content-Type':  'application/json'
    }

    const options = {
        method:   'POST',
        headers:  headers,
        body:     JSON.stringify( body ),
        redirect: 'follow'
    }

    const response = await fetch( `${ process.env.EVENT_URL }/event/add`, options )
    return await response.json()
}

export default CreateEvent