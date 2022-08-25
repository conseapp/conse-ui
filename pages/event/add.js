import styles from '../../assets/scss/event/Add.module.css'
import Header from "../../components/header";
import Nav from "../../components/nav";
import { GoPlus } from "react-icons/go";

const AddEvent = () => {

    const SubmitEvent = e => {
        e.preventDefault()

        let scenario    = document.getElementById( 'scenario' ).value,
            description = document.getElementById( 'description' ).value

        GetUserToken( "blueash", "blueash@123" )
    }

    return (
        <div className={ styles.page }>
            <Header />

            <form onSubmit={ SubmitEvent }>

                <div className={ `${ styles.scenario } ${ styles.row }` }>
                    <label htmlFor="scenario">سناریو بازی:</label>
                    <input type="text" id={ "scenario" } placeholder={ "مثلا: سناریو بازی حرفه ای" } />
                </div>

                <div className={ `${ styles.detail } ${ styles.row }` }>
                    <div className={ styles.col }>
                        <label htmlFor="people">تعداد نفرات:</label>
                        <input type="text" id={ "people" } />
                    </div>
                    <div className={ styles.col }>
                        <label htmlFor="date">تاریخ:</label>
                        <input type="text" id={ "date" } />
                    </div>
                    <div className={ styles.col }>
                        <label htmlFor="time">زمان:</label>
                        <input type="text" id={ "time" } />
                    </div>
                </div>

                <div className={ `${ styles.description } ${ styles.row }` }>
                    <label htmlFor="description">توضیحات:</label>
                    <textarea cols={ 10 } rows={ 7 } id={ "description" }></textarea>
                </div>

                <button type={ 'submit' }>ثبت</button>
            </form>

            <Nav />
        </div>
    )

}

export default AddEvent