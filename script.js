import { gsap } from 'gsap';

// Fetch Discord User Data
async function fetchDiscordUser() {
    try {
        const response = await fetch('https://discordlookup.mesalytic.moe/v1/user/765929697976516610');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Discord user:', error);
        return null;
    }
}

// Update UI with Discord data
function updateUIWithDiscordData(data) {
    if (!data) return;
    
    // Update avatar
    const avatarImg = document.getElementById('profile-avatar-img');
    avatarImg.src = data.avatar.link;
    
    // Update username and user ID
    document.getElementById('global-name').textContent = data.global_name || data.username;
    document.getElementById('username').textContent = data.username;
    document.getElementById('user-id').textContent = `ID: ${data.id}`;
    
    // Update created at date
    const createdDate = new Date(data.created_at);
    const formattedDate = createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('created-at').textContent = `Account created: ${formattedDate}`;
    
    // Update banner if available
    const profileBanner = document.getElementById('profile-banner');
    if (data.banner && data.banner.link) {
        profileBanner.style.backgroundImage = `url(${data.banner.link})`;
        profileBanner.style.backgroundSize = 'cover';
        profileBanner.style.backgroundPosition = 'center';
    } else if (data.banner && data.banner.color) {
        profileBanner.style.backgroundColor = data.banner.color;
    } else if (data.accent_color) {
        const hexColor = '#' + data.accent_color.toString(16).padStart(6, '0');
        profileBanner.style.backgroundColor = hexColor;
    }
    
    // Add badges
    const badgesContainer = document.getElementById('badges');
    badgesContainer.innerHTML = '';
    
    if (data.badges && data.badges.length > 0) {
        data.badges.forEach(badge => {
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge';
            
            let icon = 'fa-award';
            if (badge === 'HOUSE_BALANCE') icon = 'fa-scale-balanced';
            if (badge === 'STAFF') icon = 'fa-briefcase';
            if (badge === 'PARTNER') icon = 'fa-handshake';
            if (badge === 'NITRO') icon = 'fa-rocket';
            
            badgeEl.innerHTML = `<i class="fas ${icon}"></i> ${badge.replace('_', ' ')}`;
            badgesContainer.appendChild(badgeEl);
        });
    }
    
    document.title = `Discord Profile: ${data.global_name || data.username}`;
}

// Initialize background animation
function initBackgroundAnimation() {
    const container = document.getElementById('background-animation');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: '#5865F2',
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    
    const links = document.querySelectorAll('a, button, .theme-switch');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
    });
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
    });
}

// Theme switch
function initThemeSwitch() {
    const themeSwitch = document.querySelector('.theme-switch');
    if (!themeSwitch) return;
    
    const body = document.querySelector('body');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }
    
    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });
}

// Profile card effect
function initProfileCardEffect() {
    const profileCard = document.querySelector('.profile-card');
    if (!profileCard) return;
    
    profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        gsap.to(profileCard, {
            rotationY: x * 10,
            rotationX: -y * 10,
            ease: "power2.out",
            duration: 0.5,
            transformPerspective: 1000
        });
    });
    
    profileCard.addEventListener('mouseleave', () => {
        gsap.to(profileCard, {
            rotationY: 0,
            rotationX: 0,
            ease: "power2.out",
            duration: 0.5
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const userData = await fetchDiscordUser();
    updateUIWithDiscordData(userData);
    
    initBackgroundAnimation();
    initCustomCursor();
    initThemeSwitch();
    initProfileCardEffect();
});