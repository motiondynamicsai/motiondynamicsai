import { stats } from '../constants';
import styles from '../style';

const Stats = () => (
  <section className="w-full bg-primary py-12">
    <div className={`${styles.flexCenter} flex-col text-center`}>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Trusted by Athletes, Coaches, and Organisations
      </h2>
      
      <div className="flex flex-wrap justify-center gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center min-w-[150px]">
            <h4 className="text-4xl md:text-5xl font-extrabold text-gradient mb-1">
              {stat.value}
            </h4>
            <p className="text-white text-sm md:text-base uppercase tracking-wide font-medium">
              {stat.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
