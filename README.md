# Fairway Motion

A React scroll-video landing experience. The golf video stays permanently visible, uses `object-fit: contain`, and is scrubbed by page scroll progress.

## Run

```bash
npm install
npm run dev
```

The video file lives at:

```text
assets/video/golf-video.mp4
```

For the smoothest scrubbing, encode the MP4 with frequent keyframes:

```bash
ffmpeg -i input.mp4 -vf "scale=1280:-2" -an -c:v libx264 -preset medium -crf 22 -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart assets/video/golf-video.mp4
```
