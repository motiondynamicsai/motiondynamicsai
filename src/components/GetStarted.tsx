import { arrowUp } from '../assets';

const GetStarted = () => {
  const handleScroll = () => {
    const target = document.getElementById('services');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleScroll}
      title="Explore Our Services"
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
    >
      <div className="w-[80px] h-[80px] rounded-full border border-secondary/25 bg-black/20 backdrop-blur-sm p-[2px] hover:scale-105 transition-transform duration-300 shadow-[0_18px_50px_-38px_rgba(0,0,0,0.85)]">
        <div className="bg-primary/80 w-full h-full rounded-full flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1">
            <p className="text-sm font-semibold text-secondary">Get</p>
            <img src={arrowUp} alt="arrow" className="w-[20px] h-[20px]" />
          </div>
          <p className="text-sm font-semibold text-secondary">Started</p>
        </div>
      </div>
    </div>
  );
};

export { GetStarted };
export default GetStarted;
