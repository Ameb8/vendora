import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useTenant } from "../contexts/TenantContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { useCartUI } from "../contexts/CartUIContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { ProductContext } from "../contexts/ProductContext.jsx";

import Cart from "./Cart.jsx";
import ShopBy from "./ShopBy.jsx";
import CartIcon from "../icons/CartIcon.jsx";
import SearchIcon from "../icons/SearchIcon.jsx";
import FilterIcon from "../icons/FilterIcon.jsx";
import UserIcon from '../user/UserIcon.jsx';
import UserDropdown from '../user/UserDropdown.jsx';
//import LoginDropdown from '../user/LoginDropdown.jsx';
import Login from './Login';

import { Button, Form, InputGroup } from "react-bootstrap";
import './Appbar.css';

function Appbar({ onUserIconClick, userIconRef }) {
    const [cartOpen, setCartOpen] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // const userIconRef = useRef(null);
    const dropdownRef = useRef(null);

    const { tenant } = useTenant();
    const { isAuthenticated } = useUser();
    const { setSearchQuery } = useContext(ProductContext);
    const { shouldWiggle } = useCartUI();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);
    const filterRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !userIconRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    const handleSearch = () => {
        setSearchQuery(searchText);
        navigate('/inventory');
        setSearchMode(false);
        setSearchText("");
    };

    return (
        <div style={{ backgroundColor: tenant.color_primary, position: 'relative' }}>
            <nav className="appbar d-flex align-items-center justify-content-between px-3">
                {searchMode ? (
                    <div
                        className="d-flex align-items-center w-100 gap-2 mx-3"
                        ref={searchContainerRef}
                    >
                        <InputGroup className="flex-grow-1">
                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="search-input"
                                ref={inputRef}
                            />
                            <Button variant="outline-light" onClick={handleSearch}>Submit</Button>
                        </InputGroup>
                    </div>
                ) : (
                    <>
                        <div className="icon-container d-flex gap-3">
                            <SearchIcon
                                className="icon-spacing"
                                style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                onClick={() => setSearchMode(true)}
                            />
                            <FilterIcon
                                className="nav-icon left-icon"
                                style={{ width: '30px', height: '30px' }}
                                onClick={() => setShowFilterMenu(prev => !prev)}
                            />
                        </div>

                        <img src={tenant.image_url} alt="Logo" className="logo" />

                        <div className="d-flex align-items-center gap-3 position-relative">
                            <div ref={userIconRef}>
                                <UserIcon onClick={onUserIconClick} />
                            </div>

                            <div className="position-relative" onClick={() => setCartOpen(true)}>
                                <CartIcon
                                    className={`nav-icon right-icon ${shouldWiggle ? 'wiggle' : ''}`}
                                    style={{ width: '24px', height: '24px' }}
                                />
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </nav>

            <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            <div
                ref={filterRef}
                className={`filter-sidebar ${showFilterMenu ? 'open' : ''}`}
                style={{ backgroundColor: tenant.color_primary }}
            >
                <ShopBy onClose={() => setShowFilterMenu(false)} />
            </div>

            {dropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="position-absolute end-0 mt-1"
                    style={{ top: '100%', zIndex: 999 }}
                >
                    {isAuthenticated ? (
                        <UserDropdown onClose={() => setDropdownOpen(false)} />
                    ) : (
                        <Login />
                    )}
                </div>
            )}
        </div>
    );
}

export default Appbar;
