import { useNavigate } from 'react-router-dom'
import { OutlineButton } from '../components/ui/buttons';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1)

    return (
        <section className='w-full flex flex-col items-center py-8 gap-4'>
            <h1>دسترسی شما به این صفحه مجاز نمیباشد.</h1>
            <div className='w-40'>
            <OutlineButton onClick={goBack} text={'برگشت'}/>
            </div>
        </section>
    )
}

export default Unauthorized