import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../redux/store'
import '/styles/globals.scss'

function Conse({ Component, pageProps }) {
    return (
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                {/* <MainLayout> */}
                {/* <Layout> */}
                <Component {...pageProps} />
                {/* </Layout> */}
                {/* </MainLayout> */}
            </Provider>
        </PersistGate>
    )
}

export default Conse