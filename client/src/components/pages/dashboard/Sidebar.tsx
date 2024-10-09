import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

import Button from "../../common/Button";

const menuItems = [
    {
        label: "Dashboard",
        href: '/dashboard'
    },
    {
        label: 'Users',
        href: '/dashboard/users'
    },
    {
        label: 'Rooms',
        href: '/dashboard/rooms'
    },
    {
        label: 'Bookings',
        href: '/dashboard/bookings'
    },
    {
        label: 'Reports',
        href: '/dashboard/reports'
    },
];

interface SidebarOptions {
    open: boolean
    onClickMenu: () => void
}

const Sidebar = ({ open, onClickMenu }: SidebarOptions) => {

    return (
        <div className={`bg-gray-800 text-white w-64 h-screen fixed transition-transform transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="p-5 flex items-center justify-between w-full">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <Button variant="secondary" className="py-2 !px-3 lg:hidden" onClick={onClickMenu}>
                    <RxCross2 className="text-xl" />
                </Button>
            </div>
            <nav className="mt-10">
                <ul className="w-full">
                    {menuItems.map(menu => (
                        <li className="mb-1 w-full" key={menu.label}>
                            <Link to={menu.href} className="px-6 py-3 hover:text-black hover:bg-slate-100 transition-all duration-75 block">
                                {menu.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div >
    );
};

export default Sidebar;
