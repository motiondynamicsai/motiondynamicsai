const Card = ({ title, description, icon, className = '' }) => (
  <div className={`flex flex-col bg-dark p-6 rounded-lg border border-gray-800 transition-all duration-300 hover:border-secondary hover:shadow-lg hover:scale-[1.02] h-full ${className}`}>
    <div className="w-12 h-12 bg-dimBlue rounded-full flex items-center justify-center mb-4">
      <img src={icon} alt={title} className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-medium text-accent mb-2">{title}</h3>
    <p className="text-dimWhite text-sm flex-grow">{description}</p>
  </div>
)

export default Card 