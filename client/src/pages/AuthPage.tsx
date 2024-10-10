import { useSearchParams } from "react-router-dom";

import SignIn from "../components/pages/auth/Signin";
import SignUp from "../components/pages/auth/Signup";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useEffect } from "react";

const AuthPage = () => {
    const [search] = useSearchParams();
    const v = search.get('v');

    useEffect(() => {
        document.title = (v === 'signin' ? "Sign In" : "Sign Up") + " | Hotel Booking"
    }, [v])

    return (
        <>
            <Header />
            {v === 'signin' ? <SignIn /> : <SignUp />}
            <Footer />
        </>
    );
};

export default AuthPage;