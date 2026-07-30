// DOM Elements
const birthdayForm = document.getElementById('birthdayForm');
const mediaInput = document.getElementById('media');
const mediaPreview = document.getElementById('mediaPreview');
const celebrationCard = document.getElementById('celebrationCard');
const celebrantNameEl = document.getElementById('celebrantName');
const ageDisplayEl = document.getElementById('ageDisplay');
const messageDisplayEl = document.getElementById('messageDisplay');
const mediaGalleryEl = document.getElementById('mediaGallery');
const confettiBtn = document.getElementById('confettiBtn');
const confettiCanvas = document.getElementById('confettiCanvas');

// Store uploaded files
let uploadedFiles = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup form submission
    birthdayForm.addEventListener('submit', handleFormSubmit);
    
    // Setup file input change
    mediaInput.addEventListener('change', handleFileSelect);
    
    // Setup confetti button
    confettiBtn.addEventListener('click', function() {
        startConfetti();
        // Stop confetti after 5 seconds
        setTimeout(stopConfetti, 5000);
    });
    
    // Create initial balloons
    createBalloons();
});

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name) {
        alert('Please enter a name!');
        return;
    }
    
    // Update celebration card content
    celebrantNameEl.textContent = name;
    
    if (age) {
        ageDisplayEl.textContent = `Age: ${age}`;
        ageDisplayEl.style.display = 'block';
    } else {
        ageDisplayEl.style.display = 'none';
    }
    
    if (message) {
        messageDisplayEl.textContent = message;
        messageDisplayEl.style.display = 'block';
    } else {
        messageDisplayEl.style.display = 'none';
    }
    
    // Display media gallery
    displayMediaGallery();
    
    // Show celebration card
    birthdayForm.classList.add('hidden');
    celebrationCard.classList.remove('hidden');
    
    // Start animations
    createBalloons();
}

// Handle file selection
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    
    // Add new files to our collection
    uploadedFiles = [...uploadedFiles, ...files];
    
    // Update previews
    updateMediaPreviews();
}

// Update media previews
function updateMediaPreviews() {
    // Clear existing previews
    mediaPreview.innerHTML = '';
    
    // Create preview for each file
    uploadedFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'media-preview-item';
        previewItem.dataset.index = index;
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.file = file;
            previewItem.appendChild(img);
            
            const reader = new FileReader();
            reader.onload = (function(aImg) {
                return function(e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.file = file;
            video.controls = true;
            video.muted = true;
            previewItem.appendChild(video);
            
            const reader = new FileReader();
            reader.onload = (function(aVideo) {
                return function(e) {
                    aVideo.src = e.target.result;
                };
            })(video);
            reader.readAsDataURL(file);
        }
        
        // Add remove button functionality
        previewItem.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            uploadedFiles.splice(idx, 1);
            updateMediaPreviews();
        });
        
        mediaPreview.appendChild(previewItem);
    });
}

// Display media in gallery
function displayMediaGallery() {
    mediaGalleryEl.innerHTML = '';
    
    uploadedFiles.forEach(file => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'media-gallery-item';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.alt = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            
            galleryItem.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.controls = true;
            video.muted = true;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                video.src = e.target.result;
            };
            reader.readAsDataURL(file);
            
            galleryItem.appendChild(video);
        }
        
        mediaGalleryEl.appendChild(galleryItem);
    });
}

// Create floating balloons
function createBalloons() {
    const balloonsContainer = document.querySelector('.balloons');
    balloonsContainer.innerHTML = '';
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDuration = `${4 + Math.random() * 4}s`;
        balloon.style.animationDelay = `${Math.random() * 3}s`;
        balloonsContainer.appendChild(balloon);
    }
}

// Confetti effect
let confettiAnimationId = null;
let confettiParticles = [];

function startConfetti() {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
    }
    
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    
    // Create particles
    confettiParticles = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#ff6b81'];
    
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 4,
            speedY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }
    
    // Animate
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < confettiParticles.length; i++) {
            const p = confettiParticles[i];
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            
            // Reset if off screen
            if (p.y > canvas.height) {
                p.y = -p.size;
                p.x = Math.random() * canvas.width;
            }
            
            // Draw
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();
        }
        
        confettiAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopConfetti() {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
}

// Handle window resize for confetti canvas
window.addEventListener('resize', function() {
    if (confettiAnimationId) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

// Allow clicking "Start Over" to create a new card
celebrationCard.addEventListener('click', function(e) {
    if (e.target.id === 'confettiBtn') return; // Don't trigger when clicking confetti button
    
    // If clicking anywhere on the card (except confetti button), go back to form
    if (e.target.classList.contains('card-content') || e.target.classList.contains('celebration-card')) {
        celebrationCard.classList.add('hidden');
        birthdayForm.classList.remove('hidden');
        uploadedFiles = [];
        mediaPreview.innerHTML = '';
        mediaGalleryEl.innerHTML = '';
        birthdayForm.reset();
    }
});