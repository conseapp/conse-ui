import styles from '../../../../assets/scss/event/Players.module.css'
import Header from "../../../../components/header";
import Nav from "../../../../components/nav";
import {MdOutlineDelete} from "react-icons/md";

const EventPlayers = () => {
    const players = [
        {id: 1, name: 'احمدرضا ابراهیمی', role: 'mafia'},
        {id: 2, name: 'محمد صفایی', role: 'citizen'},
        {id: 2, name: 'لاله علی پور', role: 'independent'},
        {id: 1, name: 'احمدرضا ابراهیمی', role: 'mafia'},
        {id: 2, name: 'محمد صفایی', role: 'citizen'},
        {id: 2, name: 'لاله علی پور', role: 'independent'},
        {id: 1, name: 'احمدرضا ابراهیمی', role: 'mafia'},
        {id: 2, name: 'محمد صفایی', role: 'citizen'},
        {id: 2, name: 'لاله علی پور', role: 'independent'},
        {id: 1, name: 'احمدرضا ابراهیمی', role: 'mafia'},
        {id: 2, name: 'محمد صفایی', role: 'citizen'},
        {id: 2, name: 'لاله علی پور', role: 'independent'},
        {id: 1, name: 'احمدرضا ابراهیمی', role: 'mafia'},
        {id: 2, name: 'محمد صفایی', role: 'citizen'},
        {id: 2, name: 'لاله علی پور', role: 'independent'},
        {id: 1, name: 'احمدرضا ابراهیمی', role: 'mafia'},
        {id: 2, name: 'محمد صفایی', role: 'citizen'},
        {id: 2, name: 'لاله علی پور', role: 'independent'},
    ]

    const playerColor = (role) => {
        switch (role) {
            case 'mafia':
                return {backgroundColor: 'rgba(255, 0, 10, 0.1)'}
            break
            case 'citizen':
                return {backgroundColor: 'rgba(26,255,0,0.1)'}
            break
            case 'independent':
                return {backgroundColor: 'rgba(255,174,0,0.1)'}
            break
        }
    }

    return (
        <div className={styles.page}>

            <Header showProfile={false} />

            <div className="container">
                <div className={styles.header}>
                    <div className={styles.info}>
                        <h2>سناریو: بازی حرفه ای</h2>
                        <span>22 شهریور - کافه لند</span>
                    </div>
                    <span className={styles.players}>38 بازیکن</span>
                </div>

                <div className={styles.content}>
                    <table>
                        <tbody>
                        {players.map(player => {
                            return (
                                <tr key={player.id} style={playerColor(player.role)}>
                                    <td>{player.id}</td>
                                    <td>{player.name}</td>
                                    <td>
                                        <button type={"button"}>
                                            <MdOutlineDelete />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Nav />

        </div>
    )
}

export default EventPlayers