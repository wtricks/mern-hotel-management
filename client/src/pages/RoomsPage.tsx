import { useEffect } from "react";
import Footer from "../components/common/Footer"
import Header from "../components/common/Header"
import HeroSection from "../components/pages/rooms/HeroSection"
import RoomSection from "../components/pages/rooms/RoomSection"

import BackgroundImage from '../assets/banner-2.jpeg';

const RoomsPage = () => {

    useEffect(() => {
        document.title = "Our rooms | Hotel Booking"
    }, [])

    return (
        <>
            <Header />
            <HeroSection
                image={BackgroundImage}
                name="Our rooms"
                onButtonClick={() => {}}
                buttontext="Return home"
            />
            <RoomSection />
            <Footer />
        </>
    )
}

export default RoomsPage