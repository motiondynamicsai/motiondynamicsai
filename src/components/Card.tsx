interface CardProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
}

const Card = ({ title, description, icon, className = '' }: CardProps) => (
  <div className={`flex flex-col bg-dark/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 transition-all duration-300 hover:border-secondary/25 hover:bg-dark/50 h-full ${className}`}>
    <div className="w-12 h-12 bg-black/20 border border-white/5 rounded-full flex items-center justify-center mb-4">
      <img src={icon} alt={title} className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-medium text-secondary mb-2">{title}</h3>
    <p className="text-dimWhite text-sm flex-grow">{description}</p>
  </div>
);

export { Card };
export default Card;
