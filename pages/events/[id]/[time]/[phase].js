import styles from '/styles/pages/event/phase.module.scss'
import Header from "../../../../components/header";
import Nav from "../../../../components/nav";
import checkToken from "../../../../utils/checkToken";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

const Phase = props => {
    const router = useRouter()

    const { time, phase } = router.query

    const { globalUser } = useSelector(state => state.userReducer)

    // const { user } = props

    const PhaseCalculation = () => {
        let out = ''

        if ( phase === '0' ) {
            out = 'شب معارفه'
        } else {
            if ( time === 'day' ) {
                out = 'روز '
            }
            if ( time === 'mid-day' ) {
                out = 'رای گیری روز '
            }
            if ( time === 'night' ) {
                out = 'شب '
            }

            out += phase
        }

        return out
    }

    const [ nextPhase, setNextPhase ] = useState( '#' )
    useEffect( () => {
        let href = `/events/${ router.query.id }/`

        if ( time === 'day' ) {
            href += `mid-day/${ phase }`
        } else if ( time === 'mid-day' ) {
            href += `night/${ phase }`
        } else if ( time === 'night' ) {
            href += `day/${ parseInt( phase ) + 1 }`
        }

        setNextPhase( href )
    }, [ phase, router.query.id, setNextPhase, time ] )

    const [ prevPhase, setPrevPhase ] = useState( '#' )
    useEffect( () => {
        let href = `/events/${ router.query.id }/`

        if ( time === 'day' ) {
            href += `night/${ parseInt( phase ) - 1 }`
        } else if ( time === 'night' ) {
            href += `mid-day/${ phase }`
        } else if ( time === 'mid-day' ) {
            href += `day/${ phase }`
        }

        setPrevPhase( href )
    }, [ phase, router.query.id, setPrevPhase, time ] )

    return (
        <div className={ styles.page }>

            <Header user={ globalUser } profile={ false } />

            <Nav user={ globalUser } />

            <div className="container">

                <header className={ styles.header }>
                    <h2>
                        { PhaseCalculation() }
                    </h2>
                </header>

                <div className={ styles.footer }>
                    <Link href={ nextPhase }>
                        <a>فاز بعدی</a>
                    </Link>
                    {
                        parseInt( phase ) > 0 &&
                        <Link href={ prevPhase }>
                            <a>فاز قبلی</a>
                        </Link>
                    }
                </div>

            </div>

        </div>
    )
}

// export async function getServerSideProps( context ) {
//     let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

//     return {
//         props: {
//             user: user
//         }
//     }
// }

export default Phase