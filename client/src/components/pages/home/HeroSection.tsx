import { Link } from 'react-router-dom';
import BackgroundImage from '../../../assets/banner.jpg';
import Button from '../../common/Button';

const HeroSection = () => {
    return (
        <section
            className="w-full flex items-center justify-center bg-cover bg-center px-6 sm:px-12 py-12 min-h-screen"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <div className="bg-black bg-opacity-50 p-6 sm:p-12 md:p-16 rounded flex flex-col items-center text-center">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3">
                    Luxurious Rooms
                </h1>
                <p className="text-base sm:text-lg md:text-2xl text-white mb-6">
                    Deluxe Rooms Starting At $299
                </p>

                <Link to="/rooms">
                    <Button label="Book Now" variant="primary" size="large" className="mt-6 mx-auto" />
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;
