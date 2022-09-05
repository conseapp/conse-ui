import styles from '/styles/pages/explore.module.scss'
import Link from "next/link";

const Explore = props => {
    return (
        <div className={ styles.page }>
            <ul>
                {
                    props.events.map( event => {
                        return (
                            <li key={ event._id.$oid }>
                                <Link href={ `/event/${ event._id.$oid }` }>
                                    <a className={ styles.item } style={ { backgroundImage: 'url("/events-slide-1.png")' } }>
                                        <h3>{ event.title }</h3>
                                    </a>
                                </Link>
                            </li>
                        )
                    } )
                }
            </ul>
        </div>
    )
}

export async function getServerSideProps() {
    let response = await fetch( `${ process.env.EVENT_URL }/event/get/all` )
    let { data } = await response.json()

    return {
        props: {
            events: data.events
        }
    }
}

export default Explore