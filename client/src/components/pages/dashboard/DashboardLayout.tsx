import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { RootState } from "../../../store"
import Sidebar from "./Sidebar"
import Header from "./Header"

const DashboardLayout = ({ children, title}: { children: React.ReactNode, title: string }) => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user)

    const [sidebar, setSidebar] = useState(false)

    useEffect(() => {
        if (!user.user || user.user.role !== 'admin') {
            navigate('/')
        }
    }, [user.user, navigate])

    useEffect(() => {
        document.title = title + ' | Admin Panel HB'
    }, [title])

    return (
        <div className="flex flex-col lg:flex-row">
            <Sidebar open={sidebar} onClickMenu={() => setSidebar(false)} />
            <div className={`flex flex-col w-full lg:pl-64`}>
                <Header onClickMenu={() => setSidebar(!sidebar)} title={title} />
                <main className="flex-1 w-full px-12">{children}</main>
            </div>
        </div>
    )
}

export default DashboardLayout
