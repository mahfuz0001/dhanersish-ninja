# Paddy Protector

A high-energy, mobile-responsive "Fruit Ninja" style game built with Next.js, TypeScript, and Tailwind CSS.

## Game Features

### Core Gameplay
- **Canvas-based**: Full-screen HTML5 Canvas with smooth animations
- **Slice Mechanic**: Swipe/drag to slice items with a green glowing trail effect
- **Items**:
  - 🌾 Paddy (Slice for points)
  - 🗳️ Ballot (Slice for points)
  - 💣 Bomb (Avoid - Game Over!)
  - 🛣️ Broken Road (Avoid - Game Over!)
- **Physics**: Items spawn from bottom and arc upward with realistic gravity
- **Slicing Effect**: Items split in two when sliced with fade-out animation

### Visual Design
- **Color Scheme**: Green and gold gradient theme
- **Start Screen**: "Start the Harvest!" button with game instructions
- **Score Display**: "Development Points" scoreboard
- **Funny Popups**: Every 10 points displays motivational messages:
  - "Voter Power! 💪"
  - "Biryani for Everyone! 🍛"
  - "Fast Internet loading... 🚀"
  - "Digital Bangladesh 2.0! 💻"
  - "Development Express! 🚄"
  - "Golden Harvest! 🌟"

### Sound System
- **Web Audio API**: No external files needed
- **Success Sound**: Upward beep (800Hz → 1200Hz) when slicing paddy/ballot
- **Fail Sound**: Descending buzz (200Hz → 50Hz) when hitting bomb/road

### Political Rank System
Based on your score:
- 0-10: "Tea Stall Talker"
- 11-30: "Union Parishad Candidate"
- 31-70: "Member of Parliament"
- 71-150: "Minister of Development"
- 150+: "The People's Leader"

### Features
- **Local Storage**: High scores persist across sessions
- **WhatsApp Sharing**: Share your rank and score
- **Google Analytics**: Tracks game events (placeholder ID: G-XXXXXXXXXX)
  - `game_start`: When game begins
  - `slice_paddy`: When items are sliced
  - `game_over`: When game ends with score
- **Mobile Optimized**: Touch events with pointer API for cross-device support
- **Responsive**: Automatically adjusts to screen size

## How to Play

1. Click/tap "Start the Harvest!" to begin
2. Swipe across the screen to slice items
3. Slice 🌾 Paddy and 🗳️ Ballots to earn Development Points
4. Avoid slicing 💣 Bombs and 🛣️ Broken Roads
5. Try to achieve the highest political rank!

## Customization

### Replace Google Analytics ID
In `app/page.tsx` line 352:
```tsx
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```
Replace `G-XXXXXXXXXX` with your actual Google Analytics ID.

### Add Background Images
To add custom backgrounds or logos, uncomment and modify the canvas rendering code in the game loop (lines 249-325).

### Adjust Game Difficulty
- **Spawn Rate**: Modify line 151 (800ms interval)
- **Item Speed**: Modify line 160 (velocity range)
- **Item Types**: Adjust probability array on line 155

## Tech Stack

- **Framework**: Next.js 13.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Analytics**: @next/third-parties/google

## Deployment

This game is optimized for deployment on:
- Vercel
- Netlify
- Any static hosting platform

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
```
Then upload the `.next` folder to Netlify.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Browser Support

Works on all modern browsers with support for:
- HTML5 Canvas
- Pointer Events API
- Web Audio API
- Local Storage

## License

Built with love for the people. Play responsibly!
