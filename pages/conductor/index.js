import styles from '/styles/pages/conductor/index.module.scss'
import Link from "next/link";
import { MdEvent, MdOutlineGroups } from "react-icons/md";
import { GiCardRandom } from "react-icons/gi";
const Conductor = () => {
    return (
        <div className={ styles.page }>
            <ul>
                <li>
                    <Link href={ '/conductor/deck' }>
                        <a>
                            <GiCardRandom />
                            دک های شما
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={ '/conductor/event' }>
                        <a>
                            <MdEvent />
                            ایونت های شما
                        </a>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Conductor