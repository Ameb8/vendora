import { useState } from 'react';
import { useUser } from '../contexts/UserContext';

const UserIcon = () => {
    const { user, isAuthenticated, logout } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const renderAvatar = () => {
        if (user?.profile?.profile_picture) { // Display profile picture
            return <img src={user.profile.profile_picture} alt="User Avatar" className="user-icon-img" />;
        } else if (user?.initials) { // Display initials
            return <span className="user-icon-initials">{user.initials}</span>;
        } else { // Display default avatar
            return <img src="../../public/assets/default_avatar.png" alt="Default Avatar" className="user-icon-img" />;
        }
    };

    return (
        <div className="dropdown" onClick={toggleDropdown}>
            <div className="user-icon-container">
                {renderAvatar()}
            </div>

            {isDropdownOpen && (
                <div className="dropdown-menu show">
                    {isAuthenticated ? (
                        <div>
                            <button className="dropdown-item" onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <button className="dropdown-item" onClick={() => alert('Login logic here')}>Login</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserIcon;
