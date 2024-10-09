import { useSearchParams } from "react-router-dom";

import SignIn from "../components/pages/auth/Signin";
import SignUp from "../components/pages/auth/Signup";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const AuthPage = () => {
    const [search] = useSearchParams();
    const v = search.get('v');

    return (
        <>
            <Header />
            {v === 'signin' ? <SignIn /> : <SignUp />}
            <Footer />
        </>
    );
};

export default AuthPage;