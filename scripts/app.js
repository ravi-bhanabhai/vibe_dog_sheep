const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let dog = { x: 0, y: 0, size: 20 };
let sheep = { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 30, speed: 3 };
let gameActive = true;
let gameStartTime = Date.now();
let elapsedTime = 0;

// Define fence (3 sides with right side open)
let fence = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    thickness: 15,
    sides: {
        top: true,
        right: false, // Open side
        bottom: true,
        left: true
    }
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Update fence dimensions (centered, roughly 1/3 of the screen)
    fence.width = canvas.width * 0.4;
    fence.height = canvas.height * 0.4;
    fence.x = (canvas.width - fence.width) / 2;
    fence.y = (canvas.height - fence.height) / 2;
    
    // Reset sheep if it's inside the fence after resize
    if (isInsideFence(sheep.x, sheep.y)) {
        sheep.x = fence.x + fence.width + sheep.size * 2; // Position outside the open side
        sheep.y = fence.y + fence.height / 2;
    }
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function drawTimer() {
    if (gameActive) {
        elapsedTime = Date.now() - gameStartTime;
    }
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Time: ${formatTime(elapsedTime)}`, 20, 30);
}

function drawFence() {
    ctx.fillStyle = '#8B4513'; // Brown color for fence
    
    // Draw top side
    if (fence.sides.top) {
        ctx.fillRect(fence.x, fence.y, fence.width, fence.thickness);
    }
    
    // Draw right side (open)
    if (fence.sides.right) {
        ctx.fillRect(fence.x + fence.width - fence.thickness, fence.y, fence.thickness, fence.height);
    }
    
    // Draw bottom side
    if (fence.sides.bottom) {
        ctx.fillRect(fence.x, fence.y + fence.height - fence.thickness, fence.width, fence.thickness);
    }
    
    // Draw left side
    if (fence.sides.left) {
        ctx.fillRect(fence.x, fence.y, fence.thickness, fence.height);
    }
}

function isInsideFence(x, y) {
    // Check if a point is inside the fence area
    return (x > fence.x && 
            x < fence.x + fence.width && 
            y > fence.y && 
            y < fence.y + fence.height);
}

function isCollidingWithFence(x, y, radius) {
    // No collision if inside through the open side (right)
    if (isInsideFence(x, y)) {
        return false;
    }
    
    // Check collision with top side
    if (fence.sides.top && 
        x >= fence.x - radius && 
        x <= fence.x + fence.width + radius && 
        y >= fence.y - radius && 
        y <= fence.y + fence.thickness + radius) {
        return true;
    }
    
    // Check collision with right side (open)
    if (fence.sides.right && 
        x >= fence.x + fence.width - fence.thickness - radius && 
        x <= fence.x + fence.width + radius && 
        y >= fence.y - radius && 
        y <= fence.y + fence.height + radius) {
        return true;
    }
    
    // Check collision with bottom side
    if (fence.sides.bottom && 
        x >= fence.x - radius && 
        x <= fence.x + fence.width + radius && 
        y >= fence.y + fence.height - fence.thickness - radius && 
        y <= fence.y + fence.height + radius) {
        return true;
    }
    
    // Check collision with left side
    if (fence.sides.left && 
        x >= fence.x - radius && 
        x <= fence.x + fence.thickness + radius && 
        y >= fence.y - radius && 
        y <= fence.y + fence.height + radius) {
        return true;
    }
    
    return false;
}

function checkSheepInFence() {
    // Check if the sheep is inside the fence
    return isInsideFence(sheep.x, sheep.y);
}

function showWellDonePopup() {
    // Create popup container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'rgba(255, 255, 255, 0.9)';
    popup.style.padding = '2rem';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.textAlign = 'center';
    popup.style.fontFamily = 'Arial, sans-serif';
    
    // Add congratulation message
    const message = document.createElement('h2');
    message.textContent = 'Well Done!';
    message.style.color = '#4CAF50';
    message.style.marginBottom = '1rem';
    
    // Add subtext with time
    const subtext = document.createElement('p');
    subtext.textContent = `You successfully herded the sheep into the pen in ${formatTime(elapsedTime)}!`;
    subtext.style.marginBottom = '1.5rem';
    
    // Add restart button
    const button = document.createElement('button');
    button.textContent = 'Play Again';
    button.style.padding = '0.5rem 1rem';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', function() {
        document.body.removeChild(popup);
        resetGame();
    });
    
    popup.appendChild(message);
    popup.appendChild(subtext);
    popup.appendChild(button);
    document.body.appendChild(popup);
}

function resetGame() {
    // Reset the game state
    gameActive = true;
    
    // Reset the timer
    gameStartTime = Date.now();
    elapsedTime = 0;
    
    // Reposition the sheep outside the fence
    sheep.x = fence.x + fence.width + sheep.size * 2;
    sheep.y = fence.y + fence.height / 2;
    
    // Reset the dog position
    dog.x = sheep.x + 100;
    dog.y = sheep.y;
}

function drawDog() {
    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.moveTo(dog.x, dog.y - dog.size);
    ctx.lineTo(dog.x - dog.size, dog.y + dog.size);
    ctx.lineTo(dog.x + dog.size, dog.y + dog.size);
    ctx.closePath();
    ctx.fill();
}

function drawSheep() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(sheep.x, sheep.y, sheep.size, 0, Math.PI * 2);
    ctx.fill();
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function updateSheep() {
    // Save current position for fence collision check
    const prevX = sheep.x;
    const prevY = sheep.y;
    
    // First add random movement
    sheep.x += (Math.random() - 0.5) * sheep.speed;
    sheep.y += (Math.random() - 0.5) * sheep.speed;
    
    // Calculate distance between dog and sheep
    const distance = getDistance(dog.x, dog.y, sheep.x, sheep.y);
    const minDistance = sheep.size * 2;
    const awarenessDistance = minDistance * 3;
    
    // If dog is getting close (within awareness distance), move sheep away
    if (distance < awarenessDistance) {
        let dx = sheep.x - dog.x;
        let dy = sheep.y - dog.y;
        
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = dx / length;
        dy = dy / length;
        
        const distanceRatio = (awarenessDistance - distance) / awarenessDistance;
        const repelStrength = 7 * Math.pow(distanceRatio, 2);
        
        sheep.x += dx * repelStrength;
        sheep.y += dy * repelStrength;
    }

    // Check fence collision
    if (isCollidingWithFence(sheep.x, sheep.y, sheep.size)) {
        sheep.x = prevX;
        sheep.y = prevY;
    }
    
    // Keep sheep within canvas bounds
    if (sheep.x < sheep.size) sheep.x = sheep.size;
    if (sheep.x > canvas.width - sheep.size) sheep.x = canvas.width - sheep.size;
    if (sheep.y < sheep.size) sheep.y = sheep.size;
    if (sheep.y > canvas.height - sheep.size) sheep.y = canvas.height - sheep.size;
    
    // Check if sheep is inside fence
    if (checkSheepInFence() && gameActive) {
        gameActive = false;
        setTimeout(showWellDonePopup, 500); // Small delay to show the sheep inside
    }
}

function updateDogPosition(x, y) {
    if (!gameActive) return; // Don't update if game is over
    
    let newX = x;
    let newY = y;
    
    // Calculate distance between new position and sheep
    const distance = getDistance(newX, newY, sheep.x, sheep.y);
    const minDistance = dog.size + sheep.size;
    
    // If new position would cause overlap, adjust the dog position
    if (distance < minDistance) {
        let dx = newX - sheep.x;
        let dy = newY - sheep.y;
        
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = dx / length;
        dy = dy / length;
        
        newX = sheep.x + dx * minDistance;
        newY = sheep.y + dy * minDistance;
    }
    
    // Check fence collision
    if (isCollidingWithFence(newX, newY, dog.size)) {
        return; // Don't update position if colliding with fence
    }
    
    // Keep dog within canvas bounds
    if (newX < dog.size) newX = dog.size;
    if (newX > canvas.width - dog.size) newX = canvas.width - dog.size;
    if (newY < dog.size) newY = dog.size;
    if (newY > canvas.height - dog.size) newY = canvas.height - dog.size;
    
    dog.x = newX;
    dog.y = newY;
}

function update() {
    // Fill the background with green
    ctx.fillStyle = '#8BC34A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawFence();
    drawDog();
    drawSheep();
    drawTimer(); // Draw the timer
    
    if (gameActive) {
        updateSheep();
    }
    
    requestAnimationFrame(update);
}

function onMouseMove(event) {
    updateDogPosition(event.clientX, event.clientY);
}

function onTouchMove(event) {
    event.preventDefault();
    updateDogPosition(event.touches[0].clientX, event.touches[0].clientY);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('touchmove', onTouchMove, { passive: false });
resizeCanvas();
resetGame(); // Initialize the game with a fresh timer
update();