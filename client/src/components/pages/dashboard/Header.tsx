import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "../../common/Button";
import { setInitial, setUser } from "../../../store/slices/UserSlice";
import { useEffect } from "react";
import { RootState } from "../../../store";
import api from "../../../api";
import { AiOutlineMenu } from "react-icons/ai";

const Header = ({ onClickMenu, title }: { onClickMenu: () => void, title: string }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.user)

    const onLogout = () => {
        localStorage.removeItem('hm_token')
        dispatch(setUser(null))
        navigate('/')
    }

    useEffect(() => {
        if (user.initial) {
            api.get("/auth/me").then((res) => {
                dispatch(setUser(res.data.data));
            });

            dispatch(setInitial());
        }
    }, [dispatch, user.initial])

    return (
        <header className="bg-white shadow h-16 flex items-center justify-between px-5">
            <div className="flex items-center">
                <Button variant="secondary" className="mr-5 py-2 !px-3 lg:hidden" onClick={onClickMenu}>
                    <AiOutlineMenu className="text-xl" />
                </Button>
                <h1 className="text-xl font-bold">{title}</h1>
            </div>

            <Button type="button" onClick={onLogout}>
                Log out
            </Button>
        </header>
    );
};

export default Header;
