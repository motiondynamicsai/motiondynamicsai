import { Helmet } from 'react-helmet';
import { d_reconstruction, skeleton_overlay_squash, skeleton_overlay_tennis, tennis_reconstruction, padel } from '../assets';

const VideoCard = ({ src, alt, type = 'video' }) => (
  <div className="flex flex-col items-center w-[420px] mx-4">
    {type === 'video' ? (
      <video
        controls
        className="w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition duration-300"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition duration-300"
      />
    )}
    <p className="text-white text-center text-lg mt-4 font-medium">{alt}</p>
  </div>
);

const Info = () => {
  const demoVideos = [
    {
      src: d_reconstruction,
      alt: '3D Pose Reconstruction - Squash',
    },
    {
      src: skeleton_overlay_squash,
      alt: 'Skeleton Overlay and ball tracking - Squash',
    },
    {
      src: tennis_reconstruction,
      alt: '3D pose Reconstruction - Tennis'
    },
    {
      src: skeleton_overlay_tennis,
      alt: 'Skeleton Overlay and ball tracking- Tennis',
    },
    {
      src: padel,
      alt: '4 person 3D pose Reconstruction - Padel',
    },
    
  ];

  return (
    <section id="demos" className={`py-20 bg-dark`}>
      <Helmet>
        <title>Explore Our Demos - Cutting-Edge Body Tracking Technology</title>
        <meta
          name="description"
          content="Explore our cutting-edge body tracking technology through our demos. Discover how we enhance sports performance analysis through 3D reconstruction and skeleton overlays in squash and tennis."
        />
        <meta
          name="keywords"
          content="motion capture, sports tracking, 3D pose, skeleton overlay, squash analysis, tennis tracking"
        />
      </Helmet>

      <div className="container mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
              Explore Our Demos
            </span>
          </h2>
          <p className="text-dimWhite text-lg">
            Watch how our AI-powered tracking and 3D reconstruction technologies transform sports performance analysis.
          </p>
        </div>

        {/* Video Row */}
        <div className="flex flex-wrap justify-center gap-8">
          {demoVideos.map((video, index) => (
            <VideoCard key={index} {...video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Info;
