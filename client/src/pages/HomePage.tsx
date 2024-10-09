import { useEffect } from "react"
import Footer from "../components/common/Footer"
import Header from "../components/common/Header"
import FeaturedRoomsSection from "../components/pages/home/FeaturedRoomsSection"
import HeroSection from "../components/pages/home/HeroSection"
import ServicesSection from "../components/pages/home/ServicesSection"

const HomePage = () => {
    useEffect(() => {
        document.title = "Home | Hotel Booking"
    }, [])

    return (
        <>
            <Header />
            <HeroSection />
            <ServicesSection />
            <FeaturedRoomsSection />
            <Footer />
        </>
    )
}

export default HomePage