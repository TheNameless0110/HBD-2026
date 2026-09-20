
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
        icon.innerHTML = '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>';
    } else {
        bgMusic.play();
        icon.classList.add('animate-pulse', 'text-blue-200');
        icon.classList.remove('text-gray-500');
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
        
        bgMusic.volume = 0.4;
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
    
    envelopeScreen.style.opacity = '0';
    
    setTimeout(() => {
        envelopeScreen.style.display = 'none';
        
        mainContent.classList.remove('hidden');
        musicController.classList.remove('hidden');
        
        setTimeout(() => {
            mainContent.classList.remove('opacity-0');
            musicController.classList.remove('opacity-0');
            AOS.init({
                once: false, 
                mirror: true, 
                easing: 'ease-out-cubic',
                duration: 1200,
                offset: 50
            });
            initSakuraCanvas();
        }, 100);
        
    }, 2000);
}

// ----------------------------------------------------
// CINEMATIC LILY PETAL CANVAS LOGIC 
// ----------------------------------------------------
function initSakuraCanvas() {
    const canvas = document.getElementById('sakura-canvas');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    
    let particlesArray = [];
    // Fewer particles on mobile for smoother performance
    const isMobile = window.innerWidth < 768;
    const numberOfParticles = isMobile ? 20 : 40;
    
    window.addEventListener('resize', resize);

    class LilyPetal {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * (isMobile ? 5 : 8) + 3;
            this.speedY = Math.random() * 1 + 0.5; 
            this.speedX = Math.random() * 2 - 1; 
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 0.05 - 0.025;
            
            const colorType = Math.random();
            if(colorType > 0.8) {
                this.color = `rgba(200, 225, 255, ${Math.random() * 0.5 + 0.2})`;
            } else {
                this.color = `rgba(255, 250, 240, ${Math.random() * 0.5 + 0.3})`;
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
