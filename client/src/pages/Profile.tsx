import { useEffect } from "react"
import Footer from "../components/common/Footer"
import Header from "../components/common/Header"
import BodySection from "../components/pages/Profile/BodySection"

const ProfilePage = () => {

    useEffect(() => {
        document.title = "Profile | Hotel Booking"
    }, [])

    return (
        <>
            <Header />
            <BodySection />
            <Footer />
        </>
    )
}

export default ProfilePage