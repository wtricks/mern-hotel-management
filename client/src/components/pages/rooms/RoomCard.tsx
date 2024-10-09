import { Link } from "react-router-dom";
import Button from "../../common/Button";

interface RoomCardProps {
    name: string;
    price: number;
    id: string;
    image: string;
}

const RoomCard = (props: RoomCardProps) => {
    const { name, price, id, image } = props;

    return (
        <div className="group w-full rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:scale-95 relative h-full overflow-hidden max-w-xs aspect-square">
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            <div className="p-4 bg-black bg-opacity-75 absolute bottom-0 left-0 right-0">
                <h3 className="font-bold text-xl text-white text-center">{name}</h3>
            </div>

            <div className="absolute top-0 left-0 bg-black bg-opacity-90 text-white rounded-ee-3xl px-4 py-2">
                <span className="block font-bold text-lg">$ {price}</span>
                <span className="text-white text-xs">per night</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex">
                <div className="flex items-center justify-center h-full w-full bg-black bg-opacity-70">
                    <Link to={`/rooms/${id}`}>
                        <Button
                            label="Book Now"
                            variant="primary"
                            size="large"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
