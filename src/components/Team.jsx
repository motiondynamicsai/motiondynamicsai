import { team } from '../constants';
import styles from '../style';

const TeamCard = ({ img, name, title, subtitle }) => (
  <div className="flex flex-col items-center p-6 rounded-[20px] bg-dimBlue m-4 team-card transition-transform duration-300 ease-in-out hover:scale-105 w-[300px] h-[400px]">
    <img src={img} alt={name} className="w-[170px] h-[170px] rounded-full object-cover mb-4" />
    <div className="flex flex-col items-center flex-1">
      <h4 className="font-poppins font-semibold text-white text-[20px] leading-[24px] text-center mb-2">
        {name}
      </h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px] text-center mb-2">
        {title}
      </p>
      <p className="font-poppins font-normal text-dimWhite text-[14px] leading-[20px] text-center">
        {subtitle}
      </p>
    </div>
  </div>
);

const Team = () => (
  <section id="team" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}>
    <div className="w-full flex justify-between items-center sm:mb-16 mb-6 relative z-[1]">
      <h1 className={`${styles.heading2}`}>Meet the Team</h1>
    </div>

    <div className="flex flex-wrap justify-center items-center w-full relative z-[1]">
      {team.map((member) => (
        <TeamCard key={member.id} {...member} />
      ))}
    </div>
  </section>
);

export default Team;
