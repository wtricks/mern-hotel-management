import Button from '../../common/Button';

interface Props {
    image: string;
    name: string;
    buttontext: string;
    onButtonClick: () => void;
    loading?: boolean
}

const HeroSection = ({ image, name, buttontext, onButtonClick, loading }: Props) => {
    return (
        <section
            className="w-full flex items-center justify-center bg-cover bg-center px-6 sm:px-12 py-12 min-h-32"
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="bg-black bg-opacity-50 p-6 sm:p-12 md:p-16 rounded flex flex-col items-center text-center md:px-20">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3">
                   {name}
                </h1>

                <Button loading={loading} label={buttontext} onClick={onButtonClick} variant="secondary" size="large" className="mt-6 mx-auto" />
            </div>
        </section>
    );
};

export default HeroSection;
