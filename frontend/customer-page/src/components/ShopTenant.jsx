import TenantCarousel from './TenantCarousel';
import './ShopTenant.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRef } from 'react';

function ShopTenant() {
    const carouselRef = useRef(null);

    const scroll = (direction) => {
        const scrollAmount = 300;
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="shop-tenant-section py-4 px-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="shop-tenant-title">🛍️ Shop Now</h2>
                <div className="shop-tenant-controls">
                    <button className="arrow-btn me-2" onClick={() => scroll('left')}>
                        <FaChevronLeft />
                    </button>
                    <button className="arrow-btn" onClick={() => scroll('right')}>
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            {/* Pass the carousel ref into the TenantCarousel for scrolling */}
            <TenantCarousel parentWidth="100%" scrollRef={carouselRef} />
        </section>
    );
}

export default ShopTenant;
