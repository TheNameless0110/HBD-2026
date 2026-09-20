
// ----------------------------------------------------
// MUSIC CONTROLLER
// ----------------------------------------------------
let bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

function toggleMusic() {
    const icon = document.getElementById('music-icon');
    if (isPlaying) {
        bgMusic.pause();
        icon.classList.remove('animate-pulse', 'text-blue-200');
        icon.classList.add('text-gray-500');
        // Change to Play icon (Triangle)
        icon.innerHTML = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>';
    } else {
        bgMusic.play();
        icon.classList.add('animate-pulse', 'text-blue-200');
        icon.classList.remove('text-gray-500');
        // Change back to Music note
        icon.innerHTML = '<path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.536l8-1.6V12.114A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>';
    }
    isPlaying = !isPlaying;
}

// ----------------------------------------------------
// CINEMATIC CARD LOGIC
// ----------------------------------------------------
let envelopeOpened = false;

function openEnvelope() {
    if(!envelopeOpened) {
        document.querySelector('.premium-card').classList.add('open');
        envelopeOpened = true;
        
        // Play cinematic ambient music
        bgMusic.volume = 0.4; // Soft background volume
        let playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isPlaying = true;
            }).catch(e => {
                console.log("Audio play prevented by browser:", e);
                isPlaying = false;
            });
        }
    }
}

function enterMainSite(event) {
    event.stopPropagation(); 
    
    let envelopeScreen = document.getElementById('envelope-screen');
    let mainContent = document.getElementById('main-content');
    let musicController = document.getElementById('music-controller');
    
    // Slow cinematic fade out
    envelopeScreen.style.opacity = '0';
    
    setTimeout(() => {
        envelopeScreen.style.display = 'none';
        
        // Show main content
        mainContent.classList.remove('hidden');
        musicController.classList.remove('hidden');
        
        // Slow cinematic fade in
        setTimeout(() => {
            mainContent.classList.remove('opacity-0');
            musicController.classList.remove('opacity-0');
            // Initialize animations perfectly now that content is visible
            AOS.init({
                once: false, 
                mirror: true, 
                easing: 'ease-out-cubic',
                duration: 1200,
                offset: 50
            });
            initSakuraCanvas(); // Start cinematic sakura petals
        }, 100);
        
    }, 2000); // 2 second transition
}

// 

// ----------------------------------------------------
// CINEMATIC LILY PETAL CANVAS LOGIC 
// ----------------------------------------------------
function initSakuraCanvas() {
    const canvas = document.getElementById('sakura-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particlesArray = [];
    const numberOfParticles = 40; // Fewer but larger, like lily petals
    
    window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class LilyPetal {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4; // Larger than cherry blossoms
            this.speedY = Math.random() * 1 + 0.5; 
            this.speedX = Math.random() * 2 - 1; 
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 0.05 - 0.025; // Slower spin
            
            // Lily petals: Mostly pure white/cream with very soft blue tints
            const colorType = Math.random();
            if(colorType > 0.8) {
                this.color = `rgba(200, 225, 255, ${Math.random() * 0.5 + 0.2})`; // Very pale blue
            } else {
                this.color = `rgba(255, 250, 240, ${Math.random() * 0.5 + 0.3})`; // Floral white/cream
            }
        }
        update(){
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.angle) * 0.5; 
            this.angle += this.spin;
            
            if (this.y > canvas.height + this.size) {
                this.y = 0 - this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        draw(){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            
            // Draw an elongated Lily petal shape
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.size, this.size * 2, 0, this.size * 4);
            ctx.quadraticCurveTo(-this.size, this.size * 2, 0, 0);
            
            ctx.fill();
            ctx.restore();
        }
    }

    function createParticles(){
        for (let i = 0; i < numberOfParticles; i++){
            particlesArray.push(new LilyPetal());
        }
    }
    createParticles();

    function animateParticles(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++){
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}


// ----------------------------------------------------
// ELEGANT FINALE LOGIC
// ----------------------------------------------------
let candlesBlown = 0;
const totalCandles = 3;

function blowOutCandles(candleElement) {
    // If not already blown out
    if (!candleElement.classList.contains('blown-out')) {
        candleElement.classList.add('blown-out');
        candlesBlown++;
        
        if (candlesBlown === totalCandles) {
            triggerFinale();
        }
    }
}

function triggerFinale() {
    const instruction = document.getElementById('candle-instruction');
    if(instruction) instruction.style.opacity = '0';
    
    const finalWish = document.getElementById('final-wish');
    
    setTimeout(() => {
        finalWish.classList.remove('opacity-0', 'scale-95');
        finalWish.classList.add('opacity-100', 'scale-100');
        shootCinematicParticles();
    }, 1000);
}

function shootCinematicParticles() {
    const colors = ['rgba(255,215,0,0.8)', 'rgba(255,255,255,0.8)', 'rgba(255,235,150,0.6)']; 
    
    for(let i=0; i<80; i++) {
        let particle = document.createElement('div');
        particle.classList.add('cinematic-particle');
        
        particle.style.left = '50vw';
        particle.style.top = '70vh';
        
        let size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${particle.style.backgroundColor}`;
        
        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * 500 + 100;
        let x = Math.cos(angle) * distance;
        let y = Math.sin(angle) * distance - 200; 
        
        particle.animate([
            { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 5000);
    }
}
