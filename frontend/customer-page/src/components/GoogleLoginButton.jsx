import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const GoogleLoginButton = () => {
    const { login } = useUser();

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/accounts/google/`,
                { id_token: credentialResponse.credential }
            );

            // Use login from context
            await login(response.data.key);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Google Login Failed')}
            useOneTap
        />
    );
};

export default GoogleLoginButton;
