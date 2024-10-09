import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";

import api from "../../api";

import Button from "./Button";
import { type RootState } from "../../store";
import { setInitial, setUser } from "../../store/slices/UserSlice";

const MenuItems = [
    { label: "Home", path: "/" },
    { label: "Rooms", path: "/rooms" },
]


const Header = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const getActiveClass = (path: string) =>
        pathname === path ? "font-bold" : "text-black";

    useEffect(() => {
        if (user.initial) {
            api.get("/auth/me").then((res) => {
                dispatch(setUser(res.data.data));
            });

            dispatch(setInitial());
        }
    }, [dispatch, user.initial])

    return (
        <header className="w-full bg-white md:shadow sticky top-0 z-50">
            <div className="w-full max-w-7xl px-6 py-3 mx-auto flex items-center justify-between relative">
                <Link to="/" className="text-xl sm:text-2xl font-bold hover:opacity-80">
                    Hotel <span className="text-teal-500">Booking</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6 ml-10">
                    {MenuItems.map(({ label, path }) => (
                        <Link
                            key={label}
                            to={path}
                            className={`hover:opacity-80 ${getActiveClass(path)}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto hidden md:flex items-center gap-3">
                    {!user.user ? (<>
                        <Button variant="primary" onClick={() => navigate("/auth?v=signin")}>Login</Button>
                        <Button variant="secondary" onClick={() => navigate("/auth?v=signup")}>Register</Button>
                    </>) : (
                        <>
                            <Button variant="primary"  onClick={() => navigate("/profile")}>Profile</Button>
                            {user.user.role === "admin" && <Button variant="secondary"  onClick={() => navigate("/dashboard")}>Admin</Button>}
                        </>
                    )}
                </div>

                <div className="ml-auto md:hidden">
                    <Button variant="secondary" className="ml-5 py-2 !px-3" onClick={() => setShowMenu(!showMenu)}>
                        <AiOutlineMenu className="text-xl" />
                    </Button>
                </div>
            </div>

            <nav className={`md:hidden w-full px-6 py-3 bg-white border-t shadow ${showMenu ? "" : "hidden"}`}>
                {MenuItems.map(({ label, path }) => (
                    <Link
                        key={label}
                        to={path}
                        className={`hover:opacity-80 w-full block py-2 px-2 text-center hover:bg-slate-200 ${getActiveClass(path)}`}
                    >
                        {label}
                    </Link>
                ))}

                <div className="flex items-center gap-5 mt-5">
                    {!user.user ? (<>
                        <Button variant="primary" className="w-full" onClick={() => navigate("/auth?v=signin")}>Login</Button>
                        <Button variant="secondary" className="w-full" onClick={() => navigate("/auth?v=signup")}>Register</Button>
                    </>) : (
                        <>
                            <Button variant="primary" className="w-full" onClick={() => navigate("/profile")}>Profile</Button>
                            {user.user.role === "admin" && <Button variant="secondary" className="w-full"  onClick={() => navigate("/dashboard")}>Admin</Button>}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
