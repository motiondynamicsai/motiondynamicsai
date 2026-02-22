import { Helmet } from 'react-helmet';
import { d_reconstruction, skeleton_overlay_squash, skeleton_overlay_tennis, tennis_reconstruction, padel } from '../assets';

const VideoCard = ({ src, alt, type = 'video' }) => (
  <div className="relative flex flex-col items-center w-full max-w-[420px] mx-0 sm:mx-4 bg-dark/40 backdrop-blur-sm border border-white/10 rounded-lg p-4">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-secondary/60 to-accent/40 opacity-80" />
    {type === 'video' ? (
      <video
        controls
        className="w-full h-auto rounded-md border border-white/10 shadow-[0_18px_50px_-42px_rgba(0,0,0,0.85)] transition duration-300"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-md border border-white/10 shadow-[0_18px_50px_-42px_rgba(0,0,0,0.85)] transition duration-300"
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
      alt: '3D Pose Reconstruction - Tennis'
    },
    {
      src: skeleton_overlay_tennis,
      alt: 'Skeleton Overlay and Ball Tracking- Tennis',
    },
    {
      src: padel,
      alt: '4 person 3D Pose Reconstruction - Padel',
    },
    
  ];

  return (
    <section id="demos" className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] z-0 pointer-events-none" />
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

      <div className="container mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em] text-dimWhite">
            <span className="h-px w-10 bg-secondary/60" />
            Demos
            <span className="h-px w-10 bg-accent/40" />
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
            Explore Our <span className="text-secondary">Demos</span>
          </h2>
          <p className="mt-4 text-dimWhite text-lg">
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
