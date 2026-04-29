import skeletonOverlay from '../../assets/skeleton_overlay_squash_v2.mp4';

interface HeroFallbackVideoProps {
  className?: string;
}

export const HeroFallbackVideo = ({ className }: HeroFallbackVideoProps) => (
  <video
    className={className ?? 'absolute inset-0 w-full h-full object-cover'}
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    aria-hidden="true"
  >
    <source src={skeletonOverlay} type="video/mp4" />
  </video>
);

export default HeroFallbackVideo;
