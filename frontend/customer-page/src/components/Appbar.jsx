import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import './Appbar.css';
import Cart from "./Cart.jsx";
import { useCartUI } from "../contexts/CartUIContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import CartIcon from "../icons/CartIcon.jsx";
import SearchIcon from "../icons/SearchIcon.jsx";
import FilterIcon from "../icons/FilterIcon.jsx";
import { Button, Form, InputGroup } from "react-bootstrap";
import { ProductContext } from "../contexts/ProductContext.jsx";
import ShopBy from "./ShopBy.jsx";

function Appbar() {
    const [cartOpen, setCartOpen] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const { setSearchQuery } = useContext(ProductContext);


    const navigate = useNavigate();
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);

    const { shouldWiggle } = useCartUI();
    const { cartCount } = useCart();

    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);
    const filterRef = useRef(null);


    // Focus input when searchMode becomes true
    useEffect(() => {
        if (searchMode && inputRef.current) {
            inputRef.current.focus();
        }


    }, [searchMode]);

    // Click outside to exit search mode
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                searchMode &&
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target)
            ) {
                setSearchMode(false);
                setSearchText("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchMode]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                showFilterMenu &&
                filterRef.current &&
                !filterRef.current.contains(event.target)
            ) {
                setShowFilterMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilterMenu]);

    const handleSearch = () => {
        setSearchQuery(searchText);
        navigate('/inventory');
        setSearchMode(false);
        setSearchText("");
    };

    return (
        <>
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
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                                className="search-input"
                                ref={inputRef}
                            />
                            <Button variant="outline-light" onClick={handleSearch}>
                                Submit
                            </Button>
                        </InputGroup>
                    </div>
                ) : (
                    <>
                        <div className="icon-container d-flex gap-3">
                            <SearchIcon
                                className="icon-spacing"
                                role="img"
                                aria-label="Search"
                                style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                onClick={() => setSearchMode(true)}
                            />
                            <FilterIcon
                                className="nav-icon left-icon"
                                role="img"
                                aria-label="Filter"
                                style={{ width: '30px', height: '30px' }}
                                onClick={() => setShowFilterMenu(prev => !prev)}
                            />
                        </div>

                        <img src="/assets/candle_co_logo.png" alt="Logo" className="logo" />

                        <div
                            className="cart-icon-wrapper position-relative"
                            onClick={openCart}
                            style={{ cursor: 'pointer' }}
                        >
                            <CartIcon
                                className={`nav-icon right-icon ${shouldWiggle ? 'wiggle' : ''}`}
                                role="img"
                                aria-label="Cart"
                                style={{ width: '24px', height: '24px' }}
                            />
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </nav>
            <Cart isOpen={cartOpen} onClose={closeCart} />
            <div ref={filterRef} className={`filter-sidebar ${showFilterMenu ? 'open' : ''}`}>
                <ShopBy  onClose={() => setShowFilterMenu(false)} />
            </div>
        </>
    );
}

export default Appbar;


/*
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import './Appbar.css';
import Cart from "./Cart.jsx";
import { useCartUI } from "../contexts/CartUIContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import CartIcon from "../icons/CartIcon.jsx";
import SearchIcon from "../icons/SearchIcon.jsx";
import FilterIcon from "../icons/FilterIcon.jsx";
import { Button, Form, InputGroup } from "react-bootstrap";
import { ProductContext } from "../contexts/ProductContext.jsx";
import ShopBy from "./ShopBy.jsx";

function Appbar() {
    const [cartOpen, setCartOpen] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const { setSearchQuery } = useContext(ProductContext);


    const navigate = useNavigate();
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);

    const { shouldWiggle } = useCartUI();
    const { cartCount } = useCart();

    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);
    const filterRef = useRef(null);


    // Focus input when searchMode becomes true
    useEffect(() => {
        if (searchMode && inputRef.current) {
            inputRef.current.focus();
        }


    }, [searchMode]);

    // Click outside to exit search mode
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                searchMode &&
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target)
            ) {
                setSearchMode(false);
                setSearchText("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchMode]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                showFilterMenu &&
                filterRef.current &&
                !filterRef.current.contains(event.target)
            ) {
                setShowFilterMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilterMenu]);

    const handleSearch = () => {
        setSearchQuery(searchText);
        navigate('/inventory');
        setSearchMode(false);
        setSearchText("");
    };

    return (
        <>
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
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                                className="search-input"
                                ref={inputRef}
                            />
                            <Button variant="outline-light" onClick={handleSearch}>
                                Submit
                            </Button>
                        </InputGroup>
                    </div>
                ) : (
                    <>
                        <div className="icon-container d-flex gap-3">
                            <SearchIcon
                                className="icon-spacing"
                                role="img"
                                aria-label="Search"
                                style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                onClick={() => setSearchMode(true)}
                            />
                            <FilterIcon
                                className="nav-icon left-icon"
                                role="img"
                                aria-label="Filter"
                                style={{ width: '30px', height: '30px' }}
                                onClick={() => setShowFilterMenu(prev => !prev)}
                            />
                        </div>

                        <img src="/assets/candle_co_logo.png" alt="Logo" className="logo" />

                        <div
                            className="cart-icon-wrapper position-relative"
                            onClick={openCart}
                            style={{ cursor: 'pointer' }}
                        >
                            <CartIcon
                                className={`nav-icon right-icon ${shouldWiggle ? 'wiggle' : ''}`}
                                role="img"
                                aria-label="Cart"
                                style={{ width: '24px', height: '24px' }}
                            />
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </nav>
            <Cart isOpen={cartOpen} onClose={closeCart} />
            <div ref={filterRef} className={`filter-sidebar ${showFilterMenu ? 'open' : ''}`}>
                <ShopBy />
            </div>
        </>
    );
}

export default Appbar;


 */