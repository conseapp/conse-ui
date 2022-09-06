import styles from '/styles/pages/explore.module.scss'
import Link from "next/link";

const Index = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { events } = props

    return (
        <div className={ styles.page }>
            <ul>
                { events.reverse().map( event => {
                    return (
                        <li key={ event._id.$oid }>
                            <Link href={ `/events/${ event._id.$oid }` }>
                                <a className={ styles.item } style={ { backgroundImage: 'url("/events-slide-1.png")' } }>
                                    <h3>{ event.title }</h3>
                                </a>
                            </Link>
                        </li>
                    )
                } ) }
            </ul>
        </div>
    )
}

/**
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @returns {Promise<{props: {roles: *, sides: *, user: any}}>}
 */
export async function getServerSideProps() {
    let events = await fetch( `${ process.env.EVENT_URL }/event/get/all/in-going` )
    events     = await events.json()

    return {
        props: {
            events: events.data.events.reverse()
        }
    }
}

export default Index