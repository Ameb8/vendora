import './Banner.css';
import UserDropdown from './UserDropdown';

const Banner = () => {
    return (
        <header className="banner-container">
            <div className="logo-text">Vendora</div>
            <UserDropdown />
        </header>
    );
};

export default Banner;
