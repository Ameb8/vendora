import { useEffect, useState, useRef } from 'react';

export default function AboutUsOverlayCarousel() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [images, setImages] = useState([]);
    const carouselRef = useRef(null);
    const baseURL = `${import.meta.env.VITE_API_URL}/design`;

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        async function fetchContent() {
            try {
                // Fetch header/body text
                const textRes = await fetch(`${baseURL}/page-text`);
                const textData = await textRes.json();
                setTitle(textData.about_us_title);
                setBody(textData.about_us_body);

                // Fetch images
                const imgRes = await fetch(`${baseURL}/image-in-list/?list_name=about`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const imgData = await imgRes.json();
                console.log(imgData);
                setImages(imgData.map(item => item.image.image));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        fetchContent();
    }, [baseURL]);


    // Allow swiping through images
    useEffect(() => {
        const carouselInner = carouselRef.current?.querySelector('.carousel-inner');
        if (!carouselInner) return;

        const handleTouchStart = (e) => {
            touchStartX.current = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX.current = e.changedTouches[0].screenX;
            handleSwipe();
        };

        const handleSwipe = () => {
            const deltaX = touchStartX.current - touchEndX.current;
            const threshold = 50;
            if (deltaX > threshold) {
                // Swipe left → next
                carouselRef.querySelector('.carousel-control-next')?.click();
            } else if (deltaX < -threshold) {
                // Swipe right → previous
                carouselRef.querySelector('.carousel-control-prev')?.click();
            }
        };

        carouselInner.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselInner.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            carouselInner.removeEventListener('touchstart', handleTouchStart);
            carouselInner.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <div className="position-relative">
            <div id="aboutCarousel" className="carousel slide" data-bs-ride="carousel" ref={carouselRef} >
                <div className="carousel-inner">
                    {images.map((src, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <img src={src} className="d-block w-100" alt={`About image ${index + 1}`} />
                        </div>
                    ))}
                </div>

                {images.length > 1 && (
                    <>
                        <button className="carousel-control-prev" type="button" data-bs-target="#aboutCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#aboutCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </>
                )}
            </div>

            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center p-4 bg-dark bg-opacity-50">
                <h1 className="display-4">{title}</h1>
                <p className="lead" style={{ maxWidth: '600px' }}>{body}</p>
            </div>
        </div>
    );
}
