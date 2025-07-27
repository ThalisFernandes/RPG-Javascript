# RPG JavaScript Game

A modular JavaScript RPG game with clean video intro support.

## How to Run

1. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser and go to:
   ```
   http://localhost:8000
   ```

## Intro Video Setup

The game now uses a clean video-only intro system. To use this:

### Video Requirements

1. **Create a video file** named `intro.mp4`
2. **Place it in the `/video/` folder** as `video/intro.mp4`
3. **Recommended specifications**:
   - **Resolution**: 900x600 (matches game canvas)
   - **Format**: MP4 (H.264 codec)
   - **Duration**: 30-60 seconds
   - **Frame rate**: 24-30 fps
   - **File size**: Under 50MB for fast loading

### How the Intro Works

- ✅ **Auto-plays** when the game loads
- ✅ **No text overlays** - clean video experience
- ✅ **Auto-transitions** to main menu when video ends
- ✅ **Space to skip** - press space to skip to menu
- ✅ **Fallback handling** - goes to menu if video fails to load

### Video Creation Tips

- **Use your existing intro images** in sequence with smooth transitions
- **Include your story text** as overlays within the video itself
- **Add background music** (Winds of Stories, Dark Magic, Invasion of Chaos)
- **Keep it engaging** - the video should tell your story visually

### Video Creation Tools

- **Free options**: 
  - DaVinci Resolve (professional, free)
  - OpenShot (simple, free)
  - Canva (online, easy)
- **Online tools**:
  - Clipchamp
  - WeVideo
  - Adobe Express

## Game Controls

- **Arrow Keys**: Move player
- **Space**: Skip intro
- **Enter**: Confirm menu selections
- **1-5**: Combat actions (Attack, Magic, Items, Kinesis, Flee)

## Features

- ✅ Modular code structure
- ✅ Clean video-only intro system
- ✅ Auto-play and auto-transition
- ✅ Music system with multiple tracks
- ✅ Combat system
- ✅ Save/Load functionality
- ✅ Responsive UI

