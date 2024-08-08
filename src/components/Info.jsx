
import { demos } from '../constants';
import styles from '../style';

const VideoCard = ({ src, alt, type }) => (
  <div className={styles.videoCard}>
    {type === 'video' ? (
      <video src={src} alt={alt} className="w-full h-full object-cover" controls />
    ) : (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    )}
  </div>
);

const Info = () => {
  return (
    <section id="demos" className={`${styles.paddingY} flex flex-col`}>
      {/* Title and Subtext Section */}
      <div className="w-full flex flex-col items-start mb-8">
        <h2 className={styles.heading2}>Explore Our Demos</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Discover the amazing body tracking technology.
        </p>
      </div>
      
      {/* Carousel Section */}
      <div className={`${styles.carouselContainer} w-full flex`}>
        {demos.map((item, index) => (
          <VideoCard key={index} src={item.src} alt={item.alt} type={item.type} />
        ))}
      </div>
    </section>
  );
};

export default Info;
