import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function UserDropdown({ onClose }) {
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleAdminClick = () => {
        navigate('/admin');
        if (onClose) onClose();
    };

    const handleProfileClick = () => {
        navigate('/profile');
        if (onClose) onClose();
    };

    return (
        <div className="dropdown-menu show bg-white border rounded shadow p-2">
            <button
                className="btn btn-outline-primary btn-sm w-100 text-start mb-2"
                type="button"
                onClick={handleProfileClick}
            >
                My Profile
            </button>

            <button
                className="btn btn-outline-primary btn-sm w-100 text-start mb-2"
                type="button"
                onClick={handleAdminClick}
            >
                Admin Panel
            </button>

            <button
                className="btn btn-outline-danger btn-sm w-100 text-start"
                type="button"
                onClick={logout}
            >
                Logout
            </button>
        </div>
    );
}
