import { useState, useRef, useEffect } from "react";
import Appbar from "./Appbar.jsx";
import Navbar from "./Navbar.jsx";
import UserDropdown from '../user/UserDropdown.jsx';
import LoginDropdown from '../user/LoginDropdown.jsx';
import { useUser } from "../contexts/UserContext.jsx";

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const { isAuthenticated } = useUser();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !triggerRef.current?.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    return (
        <div className="position-relative">
            <Appbar
                onUserIconClick={() => setDropdownOpen((prev) => !prev)}
                userIconRef={triggerRef}
            />
            <Navbar />

            {dropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="position-absolute end-0"
                    style={{ top: '100%', zIndex: 1000 }}
                >
                    {isAuthenticated ? (
                        <UserDropdown onClose={() => setDropdownOpen(false)} />
                    ) : (
                        <LoginDropdown onLogin={() => setDropdownOpen(false)} />
                    )}
                </div>
            )}
        </div>
    );
}

export default Header;
