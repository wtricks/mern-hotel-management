const InfoCard = ({
    title,
    count,
    color,
    icon,
}: {
    title: string;
    count: string | number;
    color: string;
    icon: React.ReactNode;
}) => {
    return (
        <div className={`p-4 rounded-lg shadow-lg ${color} text-white`}>
            <div className="flex items-center">
                <div className="mr-4">{icon}</div>
                <div>
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="text-2xl">{count}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoCard