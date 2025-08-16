import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './contexts/UserContext';

export default function AdminRoot() {


    return (
        <UserProvider>
            <App />
        </UserProvider>
    );
}
