import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1)

    return (
        <section>
            <h1>Unauthorized</h1>
            <button onClick={goBack}>go back</button>
        </section>
    )
}

export default Unauthorized