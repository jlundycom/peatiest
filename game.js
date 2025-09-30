// Block Match Game Logic
class BlockMatchGame {
    constructor() {
        this.boardSize = 8;
        this.colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        this.board = [];
        this.selectedBlock = null;
        this.score = 0;
        this.moves = 0;
        this.animating = false;
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.renderBoard();
        this.attachEventListeners();
        this.updateScore();
        
        // Remove initial matches
        while (this.findMatches().length > 0) {
            this.board = [];
            this.createBoard();
        }
        this.renderBoard();
    }
    
    createBoard() {
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                this.board[row][col] = this.getRandomColor();
            }
        }
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const block = document.createElement('div');
                block.className = `block ${this.board[row][col]}`;
                block.dataset.row = row;
                block.dataset.col = col;
                
                if (this.selectedBlock && 
                    this.selectedBlock.row === row && 
                    this.selectedBlock.col === col) {
                    block.classList.add('selected');
                }
                
                gameBoard.appendChild(block);
            }
        }
    }
    
    attachEventListeners() {
        document.getElementById('game-board').addEventListener('click', (e) => {
            if (this.animating) return;
            
            const block = e.target.closest('.block');
            if (!block) return;
            
            const row = parseInt(block.dataset.row);
            const col = parseInt(block.dataset.col);
            
            this.handleBlockClick(row, col);
        });
        
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });
    }
    
    handleBlockClick(row, col) {
        if (!this.selectedBlock) {
            // First selection
            this.selectedBlock = { row, col };
            this.renderBoard();
        } else {
            // Second selection - check if adjacent
            const rowDiff = Math.abs(this.selectedBlock.row - row);
            const colDiff = Math.abs(this.selectedBlock.col - col);
            
            if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                // Adjacent blocks - attempt swap
                this.swapBlocks(this.selectedBlock.row, this.selectedBlock.col, row, col);
            } else {
                // Not adjacent - select new block
                this.selectedBlock = { row, col };
                this.renderBoard();
            }
        }
    }
    
    swapBlocks(row1, col1, row2, col2) {
        // Swap in board array
        const temp = this.board[row1][col1];
        this.board[row1][col1] = this.board[row2][col2];
        this.board[row2][col2] = temp;
        
        this.renderBoard();
        
        // Check for matches
        const matches = this.findMatches();
        
        if (matches.length > 0) {
            // Valid move
            this.moves++;
            this.selectedBlock = null;
            this.processMatches();
        } else {
            // Invalid move - swap back
            setTimeout(() => {
                this.board[row2][col2] = this.board[row1][col1];
                this.board[row1][col1] = temp;
                this.selectedBlock = null;
                this.renderBoard();
            }, 300);
        }
    }
    
    findMatches() {
        const matches = [];
        
        // Check horizontal matches
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize - 2; col++) {
                const color = this.board[row][col];
                if (color === this.board[row][col + 1] && color === this.board[row][col + 2]) {
                    // Found a match of at least 3
                    let matchLength = 3;
                    while (col + matchLength < this.boardSize && 
                           this.board[row][col + matchLength] === color) {
                        matchLength++;
                    }
                    
                    for (let i = 0; i < matchLength; i++) {
                        matches.push({ row, col: col + i });
                    }
                    
                    col += matchLength - 1;
                }
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < this.boardSize; col++) {
            for (let row = 0; row < this.boardSize - 2; row++) {
                const color = this.board[row][col];
                if (color === this.board[row + 1][col] && color === this.board[row + 2][col]) {
                    // Found a match of at least 3
                    let matchLength = 3;
                    while (row + matchLength < this.boardSize && 
                           this.board[row + matchLength][col] === color) {
                        matchLength++;
                    }
                    
                    for (let i = 0; i < matchLength; i++) {
                        matches.push({ row: row + i, col });
                    }
                    
                    row += matchLength - 1;
                }
            }
        }
        
        // Remove duplicates
        const uniqueMatches = [];
        const seen = new Set();
        
        for (const match of matches) {
            const key = `${match.row},${match.col}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueMatches.push(match);
            }
        }
        
        return uniqueMatches;
    }
    
    async processMatches() {
        this.animating = true;
        let totalMatches = 0;
        
        while (true) {
            const matches = this.findMatches();
            if (matches.length === 0) break;
            
            totalMatches += matches.length;
            
            // Remove matched blocks
            for (const match of matches) {
                this.board[match.row][match.col] = null;
            }
            
            this.renderBoard();
            await this.sleep(300);
            
            // Apply gravity
            this.applyGravity();
            this.renderBoard();
            await this.sleep(300);
            
            // Fill empty spaces
            this.fillEmptySpaces();
            this.renderBoard();
            await this.sleep(300);
        }
        
        // Update score
        this.score += totalMatches * 10;
        this.updateScore();
        
        this.animating = false;
        
        // Check for game over
        if (!this.hasPossibleMoves()) {
            this.gameOver();
        }
    }
    
    applyGravity() {
        for (let col = 0; col < this.boardSize; col++) {
            // Start from bottom and move up
            let emptyRow = this.boardSize - 1;
            
            for (let row = this.boardSize - 1; row >= 0; row--) {
                if (this.board[row][col] !== null) {
                    if (row !== emptyRow) {
                        this.board[emptyRow][col] = this.board[row][col];
                        this.board[row][col] = null;
                    }
                    emptyRow--;
                }
            }
        }
    }
    
    fillEmptySpaces() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === null) {
                    this.board[row][col] = this.getRandomColor();
                }
            }
        }
    }
    
    hasPossibleMoves() {
        // Check all possible swaps
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                // Try swapping with right neighbor
                if (col < this.boardSize - 1) {
                    const temp = this.board[row][col];
                    this.board[row][col] = this.board[row][col + 1];
                    this.board[row][col + 1] = temp;
                    
                    if (this.findMatches().length > 0) {
                        // Swap back and return true
                        this.board[row][col + 1] = this.board[row][col];
                        this.board[row][col] = temp;
                        return true;
                    }
                    
                    // Swap back
                    this.board[row][col + 1] = this.board[row][col];
                    this.board[row][col] = temp;
                }
                
                // Try swapping with bottom neighbor
                if (row < this.boardSize - 1) {
                    const temp = this.board[row][col];
                    this.board[row][col] = this.board[row + 1][col];
                    this.board[row + 1][col] = temp;
                    
                    if (this.findMatches().length > 0) {
                        // Swap back and return true
                        this.board[row + 1][col] = this.board[row][col];
                        this.board[row][col] = temp;
                        return true;
                    }
                    
                    // Swap back
                    this.board[row + 1][col] = this.board[row][col];
                    this.board[row][col] = temp;
                }
            }
        }
        
        return false;
    }
    
    showHint() {
        if (this.animating) return;
        
        // Find first possible move
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                // Try swapping with right neighbor
                if (col < this.boardSize - 1) {
                    const temp = this.board[row][col];
                    this.board[row][col] = this.board[row][col + 1];
                    this.board[row][col + 1] = temp;
                    
                    if (this.findMatches().length > 0) {
                        // Swap back
                        this.board[row][col + 1] = this.board[row][col];
                        this.board[row][col] = temp;
                        
                        // Highlight the blocks
                        this.highlightHint(row, col, row, col + 1);
                        return;
                    }
                    
                    // Swap back
                    this.board[row][col + 1] = this.board[row][col];
                    this.board[row][col] = temp;
                }
                
                // Try swapping with bottom neighbor
                if (row < this.boardSize - 1) {
                    const temp = this.board[row][col];
                    this.board[row][col] = this.board[row + 1][col];
                    this.board[row + 1][col] = temp;
                    
                    if (this.findMatches().length > 0) {
                        // Swap back
                        this.board[row + 1][col] = this.board[row][col];
                        this.board[row][col] = temp;
                        
                        // Highlight the blocks
                        this.highlightHint(row, col, row + 1, col);
                        return;
                    }
                    
                    // Swap back
                    this.board[row + 1][col] = this.board[row][col];
                    this.board[row][col] = temp;
                }
            }
        }
    }
    
    highlightHint(row1, col1, row2, col2) {
        const blocks = document.querySelectorAll('.block');
        blocks.forEach(block => {
            const row = parseInt(block.dataset.row);
            const col = parseInt(block.dataset.col);
            
            if ((row === row1 && col === col1) || (row === row2 && col === col2)) {
                block.classList.add('hint');
                setTimeout(() => {
                    block.classList.remove('hint');
                }, 2000);
            }
        });
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('moves').textContent = this.moves;
    }
    
    gameOver() {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').classList.remove('hidden');
    }
    
    resetGame() {
        this.board = [];
        this.selectedBlock = null;
        this.score = 0;
        this.moves = 0;
        this.animating = false;
        
        document.getElementById('game-over').classList.add('hidden');
        
        this.init();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new BlockMatchGame();
});
