import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ShopTenant from "../components/ShopTenant";
//import TenantCarousel from './TenantCarousel';
import TenantSignup from '../tenant_signup/TenantSignup.jsx';
import Banner from './Banner';


function HomePage() {
    return (
        <div className="container mt-4 text-center">
            <Banner />
            {/*<TenantSignup />
            <TenantCarousel parentWidth="100%" />*/}

            <ShopTenant />

            <div className="mt-5">
                <Button
                    as={Link}
                    to="/signup"
                    variant="primary"
                    size="lg"
                    className="fw-bold px-5 py-3 shadow"
                >
                    Boost Your Business Today 🚀
                </Button>
            </div>
        </div>
    );
}

export default HomePage;