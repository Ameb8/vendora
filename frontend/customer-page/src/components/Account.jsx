import { useUser } from '../contexts/UserContext';

const Account = () => {
    const { user, logout } = useUser();

    return (
        <div>
            <p className="mb-1"><strong>{user.username}</strong></p>
            <button className="btn btn-sm btn-danger" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Account;

