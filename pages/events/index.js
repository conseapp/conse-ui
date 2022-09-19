import styles from '/styles/pages/explore.module.scss'
import Link from "next/link";
import checkToken from "../../utils/checkToken";
import Head from "next/head";
import Nav from "../../components/nav";
import Header from "../../components/header";
import { useState } from "react";
import { MdSearch } from "react-icons/md";

const Index = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { user, events } = props

    const [ Events, SetEvents ] = useState( events )

    const Search = async e => {
        let val = e.target.value

        if ( val.length > 0 ) {
            let request  = await fetch( `${ process.env.EVENT_URL }/event/explore/${ val }` )
            let response = await request.json()

            SetEvents( response.data.reverse() )
        } else {
            SetEvents( events )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>ایونت ها</title>
            </Head>

            <Header user={ user } profile={ false } />

            <Nav user={ user } />

            <div className={ styles.search }>
                <label>
                    <input type={ "text" } onChange={ Search } placeholder={ "جست و جو کنید" } />
                    <MdSearch />
                </label>
            </div>

            <div className="container">
                {
                    Events.length > 0 ?
                        <ul className={ styles.list }>
                            {
                                Events.map( event => {
                                    return (
                                        <li key={ event._id.$oid }>
                                            <Link href={ `/events/${ event._id.$oid }` }>
                                                <a className={ styles.item } style={ { backgroundImage: 'url("/events-slide-1.png")' } }>
                                                    <h3>{ event.title }</h3>
                                                </a>
                                            </Link>
                                        </li>
                                    )
                                } )
                            }
                        </ul> :
                        <div className={ styles.notFound }>
                            <span className={ styles.icon }>
                                :(
                            </span>
                            <h2>متاسفانه نتیجه ای یافت نشد !!</h2>
                            <h4>لطفا دوباره تلاش کنید</h4>
                        </div>
                }

            </div>

        </div>
    )
}

export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    // Get events
    let events = await fetch( `${ process.env.EVENT_URL }/event/get/all/in-going` )
    events     = await events.json()

    return {
        props: {
            user:   user,
            events: events.data.reverse()
        }
    }
}

export default Index