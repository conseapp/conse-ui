import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../redux/store'
import '/styles/globals.scss'
import { createWrapper } from 'next-redux-wrapper';

// import type { AppProps } from 'next/app';


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


// const makeStore = () => store;
// const wrapper = createWrapper(makeStore);
// export default wrapper.withRedux(Conse);

export default Conse
