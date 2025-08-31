import { useUser } from '../contexts/UserContext';

export default function UserDropdown({ onClose }) {
    const { logout } = useUser();

    return (
        <div className="custom-dropdown">
            <button className="dropdown-item" onClick={logout}>Logout</button>
        </div>
    );
}


