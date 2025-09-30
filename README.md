# peatiest

A progressive web application (PWA) featuring a block matching puzzle game.

## Block Match Game

A colorful block matching puzzle game where you swap adjacent blocks to create patterns of 3 or more identical blocks. When blocks match, they disappear and new blocks fall from above, potentially creating chain reactions!

### How to Play

1. **Open the game**: Open `index.html` in a web browser or serve it via a local HTTP server
2. **Make matches**: Click on a block, then click on an adjacent block to swap them
3. **Create patterns**: Match 3 or more blocks of the same color horizontally or vertically
4. **Watch the cascade**: When blocks are removed, new blocks fall down and may create additional matches
5. **Game over**: The game ends when there are no more possible moves

### Features

- **Progressive Web App**: Can be installed on your device and works offline
- **Responsive Design**: Works on desktop and mobile devices
- **Score Tracking**: Earn points for each block matched
- **Move Counter**: Track how many moves you've made
- **Hint System**: Click the "Hint" button to see a possible valid move
- **New Game**: Start a fresh game anytime with the "New Game" button
- **Smooth Animations**: Enjoy smooth block swapping and falling animations
- **Chain Reactions**: Create cascading matches for higher scores

### Running the Game

#### Using Python HTTP Server
```bash
python3 -m http.server 8080
```
Then open http://localhost:8080 in your browser.

#### Using Node.js HTTP Server
```bash
npx http-server
```

### PWA Installation

The game can be installed as a Progressive Web App on supported devices:
1. Open the game in a browser
2. Look for the "Install" or "Add to Home Screen" option
3. The game will be available as a standalone app with offline support

### Technologies Used

- **HTML5**: Structure and semantics
- **CSS3**: Styling with gradients, animations, and responsive design
- **JavaScript**: Game logic and interactivity
- **Service Worker**: Offline functionality
- **Web App Manifest**: PWA configuration
