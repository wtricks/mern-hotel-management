interface CardProps {
    title: string;
    children: React.ReactNode;
}

const Card= ({ title, children }: CardProps) => {
    return (
        <div className="max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden p-6 mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
            {children}
        </div>
    );
};

export default Card;
