import { logout } from '../firebase/service';

const SignOut = () => {
    return (
        <button className='w-10 h-30 text-xl' onClick={logout}>
            Sair
        </button>
    );
};

export default SignOut;
