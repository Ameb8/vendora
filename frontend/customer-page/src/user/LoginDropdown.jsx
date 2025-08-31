export default function LoginDropdown({ onLogin }) {
    return (
        <div className="custom-dropdown">
            <button className="dropdown-item" onClick={onLogin}>Login</button>
        </div>
    );
}
