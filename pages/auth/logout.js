import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

const Logout = () => {
    const Route = useRouter()

    deleteCookie( 'access_token' )

    Route.push( '/' )
}

export default Logout