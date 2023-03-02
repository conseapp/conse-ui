import styles from '/styles/components/alert.module.scss'
import { useEffect, useState } from "react";
import { MdCheckCircle, MdDangerous, MdInfo, MdWarning } from "react-icons/md";

const Alert = ( { children, ...pageProps } ) => {
    const props = pageProps

    console.log( props )

    const [ Class, setClass ] = useState( '' )
    const [ Icon, setIcon ]   = useState( <MdInfo /> )

    useEffect( () => {
        switch ( props.type ) {
            case "info":
                setClass( styles.info )
                setIcon( <MdInfo /> )
                break
            case "danger":
                setClass( styles.danger )
                setIcon( <MdDangerous /> )
                break
            case "warning":
                setClass( styles.warning )
                setIcon( <MdWarning /> )
                break
            case "success":
                setClass( styles.success )
                setIcon( <MdCheckCircle /> )
                break
        }
    }, [ props.type ] )

    return (
        <div className={ `${ styles.alert } ${ Class }` }>
            { Icon }
            <span>{ children }</span>
        </div>
    )

}

export default Alert