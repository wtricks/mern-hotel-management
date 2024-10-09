import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full bg-neutral-800 py-6 px-6 sm:px-12">
            <h5 className="text-center text-white py-3 text-2xl sm:text-3xl md:text-4xl">
                Hotel Booking | Hotel Management System
            </h5>
            <p className="text-center text-white text-sm sm:text-base">
                &copy; {new Date().getFullYear()} Hotel Booking -- Developed By{" "}
                <Link 
                    className="text-teal-500 hover:opacity-85 transition-opacity duration-200" 
                    to="https://github.com/wtricks" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Anuj Kumar
                </Link>
            </p>
        </footer>
    );
};

export default Footer;
