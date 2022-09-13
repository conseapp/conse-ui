import '/styles/globals.scss'
import { Provider } from "react-redux";
import { store } from "../app/store";

function Conse( { Component, pageProps } ) {
    return (
        <Provider store={ store }>
            <Component { ...pageProps } />
        </Provider>
    )
}

export default Conse