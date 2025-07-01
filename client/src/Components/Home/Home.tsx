import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import style from './Home.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

// Interface defining the structure of a Product object
interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
}

const Home: React.FC = () => {
    // State to hold the list of products fetched from the API
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    // useEffect to fetch products on component mount
    useEffect(() => {
        fetch('${import.meta.env.VITE_API_BASE_URL}/api/products')
            .then((res) => res.json())
            .then((data: Product[]) => setProducts(data)) // Update state with fetched products
            .catch((err) => console.error('Failed to fetch products:', err)); // Log errors if fetch fails
    }, []);

    // Configuration settings for the react-slick slider component
    const sliderSettings = {
        dots: true, // Show navigation dots below the slider
        infinite: true, // Enable infinite looping of slides
        slidesToShow: 3, // Number of slides visible at once
        slidesToScroll: 1, // Number of slides to scroll on navigation
        autoplay: true, // Enable automatic slide transition
        autoplaySpeed: 3000, // Duration each slide is displayed (ms)
        speed: 800, // Transition speed (ms)
        cssEase: 'ease-in-out', // Easing function for slide animation
        responsive: [ // Responsive settings for different screen widths
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className={style.homeContainer}>
            {/* Hero section with welcome message and call-to-action button */}
            <section className={style.hero}>
                <div className={style.heroOverlay}>
                    <h1>Welcome to GadgetGear</h1>
                    <p>Explore the Future of Tech</p>
                    {/* Navigate to products page on button click */}
                    <button onClick={() => navigate('/products')}>Shop Now</button>
                </div>
            </section>

            {/* Carousel section displaying featured products */}
            <section className={style.carouselWrapper}>
                <h2>Featured Products</h2>
                <Slider {...sliderSettings}>
                    {products.map((product) => (
                        <div className={style.carouselItem} key={product._id}>
                            {/* Display product image with alt text for accessibility */}
                            <img
                                className={style.productImg}
                                src={`./src/assets/${product.name}.webp`}
                                alt={product.name}
                            />
                            <h3>{product.name}</h3>
                            <p>${product.price}</p>
                        </div>
                    ))}
                </Slider>
            </section>
        </div>
    );
};

export default Home;
