// ============================================
// AR HAZARD VISUALIZATION SYSTEM
// Cabiao Senior High School
// ============================================

// Global State
const state = {
    isLoggedIn: false,
    user: null,
    currentSection: 'home',
    aiChatOpen: false,
    cameraActive: false
};

// ============================================
// LOADING SCREEN
// ============================================
function initLoading() {
    const progress = document.getElementById('loadingProgress');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContainer = document.getElementById('mainContainer');
    
    let percent = 0;
    const interval = setInterval(() => {
        percent += Math.random() * 15;
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                mainContainer.style.display = 'block';
                initParticles();
            }, 500);
        }
        progress.style.width = percent + '%';
    }, 200);
}

// ============================================
// PARTICLE SYSTEM
// ============================================
function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: ${Math.random() > 0.5 ? '#ff4444' : '#ff8800'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        `;
        container.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = ['home', 'ar-view', 'forecast', 'alerts'];
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(s => {
                const el = document.getElementById(s);
                if (el) el.style.display = s === section ? 'block' : 'none';
            });
            
            if (section === 'home') {
                document.querySelector('.hero-section').style.display = 'flex';
            } else {
                document.querySelector('.hero-section').style.display = 'none';
            }
            
            state.currentSection = section;
        });
    });
    
    document.getElementById('btnStartAR')?.addEventListener('click', () => {
        document.querySelector('[data-section="ar-view"]').click();
    });
}

// ============================================
// AUTHENTICATION MODALS
// ============================================
function initModals() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    document.getElementById('btnLogin')?.addEventListener('click', () => {
        loginModal.classList.add('active');
    });
    
    document.getElementById('btnSignup')?.addEventListener('click', () => {
        signupModal.classList.add('active');
    });
    
    document.getElementById('closeLogin')?.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });
    
    document.getElementById('closeSignup')?.addEventListener('click', () => {
        signupModal.classList.remove('active');
    });
    
    document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });
    
    document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });
    
    // Close modal on overlay click
    [loginModal, signupModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Form submissions
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
    
    // Social login buttons
    document.getElementById('btnGoogleLogin')?.addEventListener('click', () => socialLogin('Google'));
    document.getElementById('btnFacebookLogin')?.addEventListener('click', () => socialLogin('Facebook'));
    document.getElementById('btnGoogleSignup')?.addEventListener('click', () => socialLogin('Google'));
    document.getElementById('btnFacebookSignup')?.addEventListener('click', () => socialLogin('Facebook'));
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login
    simulateLogin(email);
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    
    simulateLogin(email, name);
}

function socialLogin(provider) {
    showToast(`Connecting to ${provider}...`);
    setTimeout(() => {
        simulateLogin(`user@${provider.toLowerCase()}.com`);
    }, 1500);
}

function simulateLogin(email, name = null) {
    state.isLoggedIn = true;
    state.user = {
        email: email,
        name: name || email.split('@')[0]
    };
    
    document.getElementById('loginModal')?.classList.remove('active');
    document.getElementById('signupModal')?.classList.remove('active');
    
    updateUIForLogin();
    showToast('Login successful! Welcome to AR Hazard System');
}

function updateUIForLogin() {
    document.querySelector('.header-actions').innerHTML = `
        <div class="user-menu">
            <div class="user-avatar" style="background: linear-gradient(135deg, #ff4444, #ff8800); display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 40px; height: 40px; font-weight: bold;">
                ${state.user.name.charAt(0).toUpperCase()}
            </div>
            <span class="user-name">${state.user.name}</span>
            <button class="btn-logout" onclick="handleLogout()">LOGOUT</button>
        </div>
    `;
}

function handleLogout() {
    state.isLoggedIn = false;
    state.user = null;
    
    document.querySelector('.header-actions').innerHTML = `
        <button class="btn-login" id="btnLogin">LOGIN</button>
        <button class="btn-signup" id="btnSignup">SIGN UP</button>
    `;
    
    document.getElementById('btnLogin')?.addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('active');
    });
    
    document.getElementById('btnSignup')?.addEventListener('click', () => {
        document.getElementById('signupModal').classList.add('active');
    });
    
    showToast('Logged out successfully');
}

// ============================================
// AI ASSISTANT
// ============================================
function initAIAssistant() {
    const avatar = document.getElementById('aiAvatar');
    const chat = document.getElementById('aiChat');
    const closeBtn = document.getElementById('aiClose');
    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSend');
    const tooltip = document.getElementById('aiTooltip');
    
    avatar?.addEventListener('click', () => {
        chat.style.display = chat.style.display === 'none' ? 'block' : 'none';
        tooltip.style.display = 'none';
    });
    
    closeBtn?.addEventListener('click', () => {
        chat.style.display = 'none';
    });
    
    sendBtn?.addEventListener('click', () => sendAIMessage());
    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    if (!message) return;
    
    addMessageToChat(message, 'user');
    input.value = '';
    
    // AI Response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessageToChat(response, 'bot');
    }, 1000);
}

function addMessageToChat(text, type) {
    const messages = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = `ai-message ${type}`;
    div.innerHTML = `<p>${text}</p>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function generateAIResponse(message) {
    const lower = message.toLowerCase();
    
    const responses = {
        'hello': 'Hello! I\'m ARVIS, your AI guide. How can I help you navigate the AR Hazard Visualization system?',
        'help': 'Here\'s what I can help you with:\n• Navigate the website\n• Explain AR features\n• Weather forecast info\n• Alert notifications\n• Safety guidelines',
        'ar': 'The AR (Augmented Reality) feature lets you point your phone camera at an area to visualize potential hazards like flooding and heavy rain before they happen!',
        'weather': 'Our weather forecast shows rain levels for the next 3 days. The color coding is:\n• GREEN = Safe (0-30%)\n• ORANGE = Warning (31-70%)\n• RED = Danger (71-100%)',
        'flood': 'Flood risk is calculated based on rain level, terrain elevation, and historical data. Areas shown in RED have high flood potential during heavy rain.',
        'alert': 'Our alert system notifies you of hazardous weather conditions. You\'ll receive warnings for:\n• Heavy rainfall\n• Flood warnings\n• Storm advisories',
        'rain': 'Rain levels are categorized as:\n• Light Rain: 0-30%\n• Moderate Rain: 31-60%\n• Heavy Rain: 61-85%\n• Severe Rain: 86-100%',
        'safe': 'Safety tips during rainy season:\n• Avoid low-lying areas\n• Stay informed about weather updates\n• Have an evacuation plan ready\n• Keep emergency supplies handy',
        'cabiao': 'This system is designed specifically for Cabiao Senior High School to help students and faculty stay safe during the rainy season.',
        'how': 'To use the AR feature:\n1. Click "START AR EXPERIENCE"\n2. Allow camera access\n3. Point your device at an area\n4. View the hazard overlay and analysis'
    };
    
    for (const [key, value] of Object.entries(responses)) {
        if (lower.includes(key)) return value;
    }
    
    return 'I can help you with AR visualization, weather forecasts, alerts, and safety information. What would you like to know?';
}

// ============================================
// AR FEATURES
// ============================================
function initARFeatures() {
    document.getElementById('btnStartCamera')?.addEventListener('click', startCamera);
    document.getElementById('btnCapture')?.addEventListener('click', captureImage);
    document.getElementById('btnInfo')?.addEventListener('click', showARInfo);
}

function startCamera() {
    const viewport = document.getElementById('arViewport');
    const placeholder = viewport.querySelector('.ar-placeholder');
    const overlay = document.getElementById('arOverlay');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.autoplay = true;
                video.playsInline = true;
                video.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 18px;';
                placeholder.style.display = 'none';
                viewport.insertBefore(video, overlay);
                overlay.style.display = 'block';
                state.cameraActive = true;
                
                // Start AR simulation
                simulateARHazard();
            })
            .catch(err => {
                showToast('Camera access denied. Using simulated AR view.');
                placeholder.innerHTML = `
                    <i class="fas fa-vr-cardboard" style="font-size: 5rem; color: #ff4444; margin-bottom: 20px;"></i>
                    <p>AR Simulation Mode</p>
                    <p style="color: #888; font-size: 0.9rem; margin-top: 10px;">Enable camera in browser for full experience</p>
                `;
                overlay.style.display = 'block';
                simulateARHazard();
            });
    }
}

function simulateARHazard() {
    const levels = ['LIGHT', 'MODERATE', 'HEAVY', 'SEVERE'];
    const risks = ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'];
    const statuses = ['SAFE', 'WARNING', 'DANGER', 'CRITICAL'];
    const statusClasses = ['status-safe', 'status-warning', 'status-danger', 'status-danger'];
    
    setInterval(() => {
        const idx = Math.floor(Math.random() * 4);
        document.getElementById('arRainLevel').textContent = levels[idx];
        document.getElementById('arRainLevel').className = `data-value ${statusClasses[idx]}`;
        
        document.getElementById('arFloodRisk').textContent = risks[idx];
        document.getElementById('arFloodRisk').className = `data-value ${statusClasses[idx]}`;
        
        document.getElementById('arStatus').textContent = statuses[idx];
        document.getElementById('arStatus').className = `data-value ${statusClasses[idx]}`;
        
        // Update indicator color
        const indicator = document.getElementById('hazardIndicator');
        const colors = ['#00cc44', '#ff8800', '#ff4444', '#ff0000'];
        indicator.querySelectorAll('.indicator-ring').forEach(ring => {
            ring.style.borderColor = colors[idx];
        });
    }, 3000);
}

function captureImage() {
    showToast('Screenshot captured! (Feature for full app)');
}

function showARInfo() {
    document.getElementById('featureARModal').classList.add('active');
}

// ============================================
// FEATURE MODALS
// ============================================
function closeFeatureModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Feature card clicks
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => {
        const modal = card.dataset.modal;
        if (modal === 'feature-ar') document.getElementById('featureARModal').classList.add('active');
        if (modal === 'feature-weather') document.getElementById('featureWeatherModal').classList.add('active');
        if (modal === 'feature-alert') document.getElementById('featureAlertModal').classList.add('active');
    });
});

// Close feature modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});

// ============================================
// DATE DISPLAY
// ============================================
function updateDate() {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    const todayDate = document.getElementById('todayDate');
    if (todayDate) todayDate.textContent = today;
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: linear-gradient(135deg, #ff4444, #ff8800);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 5px 20px rgba(255, 68, 68, 0.4);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
});

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initNavigation();
    initModals();
    initAIAssistant();
    initARFeatures();
    updateDate();
});

// Make closeFeatureModal globally accessible
window.closeFeatureModal = closeFeatureModal;
window.handleLogout = handleLogout;
