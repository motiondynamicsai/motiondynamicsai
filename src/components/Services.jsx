import {features} from '../constants';
import styles, {layout} from '../style';
import Button from './Button';

const FeatureCard = ({icon, title, content, index}) => (
  <div>
    <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length -1} ? "mb-6" : "mb-0"} feature-card `}>
      <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
        <img src={icon} alt="icon" className="w-[50%] h-[50%] object-contain"/>
      </div>
      <div className="flex-1 flex flex-col ml-3">
        <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23px]">
          {title}
        </h4>
        <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
          {content}
        </p>

      </div>
    </div>
  </div>
)

const Services = () => {
  return (
    <section id="features" className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>How it works </h2>
          <p className={`${styles.paragraph} max-w-[470px]`}>
            Use our motion capture technology and advanced analytical algorithms you to gain a deeper understanding of your game 
          </p>
          <Button styles="mt-10"/>
      </div>

      <div className={`${layout.sectionImg} flex-col`}>
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} {...feature} index={index}/>
        ))}

      </div>


    </section>
  )
}

export default Services
