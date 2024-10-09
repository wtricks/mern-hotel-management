import { FaCocktail, FaHiking, FaShuttleVan } from "react-icons/fa"

const ServicesSection = () => {
    return (
        <section className="w-full bg-gray-200 grid py-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-12">
            <div className="flex flex-col items-center px-12">
                <FaCocktail className="text-6xl mb-1" />
                <h5 className="text-2xl font-bold">Free Cocktails</h5>
                <p className="text-center mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores est eaque error provident unde eligendi.</p>
            </div>
            <div className="flex flex-col items-center px-12">
                <FaHiking className="text-6xl mb-1" />
                <h5 className="text-2xl font-bold">Endless Hiking</h5>
                <p className="text-center mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores est eaque error provident unde eligendi.</p>
            </div>
            <div className="flex flex-col items-center px-12">
                <FaShuttleVan className="text-6xl mb-1" />
                <h5 className="text-2xl font-bold">Free Shuttle</h5>
                <p className="text-center mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores est eaque error provident unde eligendi.</p>
            </div>
        </section>
    )
}

export default ServicesSection;