import { useEffect, useState, useRef } from 'react';

export default function ContactOverlayCarousel() {
    const [contactNum, setContactNum] = useState('');
    const [contactMail, setContactMail] = useState('');
    const [images, setImages] = useState([]);
    const carouselRef = useRef(null);
    const baseURL = `${import.meta.env.VITE_API_URL}/design`;

    useEffect(() => {
        async function fetchContent() {
            try {
                // Fetch contact information
                const textRes = await fetch(`${baseURL}/page-text`);
                const textData = await textRes.json();
                setContactNum(textData.contact_num);
                setContactMail(textData.contact_mail);

                // Fetch contact images
                const imgRes = await fetch(`${baseURL}/image-in-list/?list_name=contact`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const imgData = await imgRes.json();
                setImages(imgData.map(item => item.image.image));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        fetchContent();
    }, [baseURL]);

    return (
        <div className="position-relative">
            <div className="text-center b py-4">
                <h2>Contact Us</h2>
                {contactNum && <p>Phone: {contactNum}</p>}
                {contactMail && <p>Email: {contactMail}</p>}
            </div>

            <div id="contactCarousel" className="carousel slide" data-bs-ride="carousel" ref={carouselRef}>
                <div className="carousel-inner">
                    {images.map((src, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <img src={src} className="d-block w-100" alt={`Contact image ${index + 1}`} />
                        </div>
                    ))}
                </div>

                {images.length > 1 && (
                    <>
                        <button className="carousel-control-prev" type="button" data-bs-target="#contactCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#contactCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
