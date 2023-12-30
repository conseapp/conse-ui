// import CircularProgress from '@mui/joy/CircularProgress';
import CircularProgress from '@mui/material/CircularProgress';

const Circular = () => {
    return (
        <div className='w-full flex justify-center'>
            <CircularProgress
                size={35} sx={{ color: '#3EAEFF' }}
            />
        </div>
    );
}

export default Circular;