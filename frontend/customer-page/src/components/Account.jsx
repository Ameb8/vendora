import { useUser } from '../contexts/UserContext';

const Account = () => {
    const { user, logout } = useUser();

    const handlePrintUser = () => {
        console.log('User details:', user);
    };


    return (
        <div>
            <p className="mb-1"><strong>{user.username}</strong></p>
            <button className="btn btn-sm btn-primary me-2" onClick={handlePrintUser}>
                Print User to Console
            </button>
            <button className="btn btn-sm btn-danger" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Account;

