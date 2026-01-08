// DOM Elements
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const tabIndicator = document.getElementById('tabIndicator');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserName = document.getElementById('currentUserName');

const chatArea = document.getElementById('chatArea');
const historyList = document.getElementById('historyList');
const sessionStatus = document.getElementById('sessionStatus');
const newSessionBtn = document.getElementById('newSessionBtn');

const textBtn = document.getElementById('textBtn');
const fileBtn = document.getElementById('fileBtn');
const voiceBtn = document.getElementById('voiceBtn');
const textInputContainer = document.getElementById('textInputContainer');
const fileUploadUI = document.getElementById('fileUploadUI');
const recordingUI = document.getElementById('recordingUI');
const textInput = document.getElementById('textInput');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');

const purposeModal = document.getElementById('purposeModal');
const purposeGrid = document.getElementById('purposeGrid');
const confirmPurposeBtn = document.getElementById('confirmPurposeBtn');
const cancelPurposeBtn = document.getElementById('cancelPurposeBtn');

const browseFiles = document.getElementById('browseFiles');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

// Voice Recording Elements
const startRecordingBtn = document.getElementById('startRecordingBtn');
const stopRecordingBtn = document.getElementById('stopRecordingBtn');
const timer = document.getElementById('timer');
const recordingDot = document.getElementById('recordingDot');
const voiceVisualizer = document.getElementById('voiceVisualizer');
const voiceWave = document.getElementById('voiceWave');
const recordingStatus = document.getElementById('recordingStatus');

const loadingOverlay = document.getElementById('loadingOverlay');
const loadingMessage = document.getElementById('loadingMessage');

// State Variables
let currentInputMethod = 'text';
let selectedPurpose = null;
let isRecording = false;
let recordingTime = 0;
let recordingInterval = null;
let currentSession = null;
let isSessionActive = false;

// Voice Recording Variables
let mediaRecorder = null;
let audioChunks = [];
let audioContext = null;
let analyser = null;
let dataArray = null;
let animationId = null;

// User Database (using localStorage for persistence)
const USER_STORAGE_KEY = 'aiPracticeUsers';
const CURRENT_USER_KEY = 'aiPracticeCurrentUser';

// Sample Data
const practiceHistory = [
    { id: 1, title: "Technical Interview Prep", date: "2023-10-15", purpose: "Interview Preparation", duration: "15 min", status: "completed" },
    { id: 2, title: "Project Presentation", date: "2023-10-14", purpose: "Presentation Practice", duration: "20 min", status: "completed" },
    { id: 3, title: "Self Introduction", date: "2023-10-12", purpose: "Self-Introduction Practice", duration: "10 min", status: "completed" },
    { id: 4, title: "Communication Skills", date: "2023-10-10", purpose: "Communication Skills Improvement", duration: "25 min", status: "active" }
];

const practicePurposes = [
    { id: 1, icon: "fas fa-briefcase", title: "Interview Preparation", desc: "HR, Technical, Behavioral interviews", color: "#4361ee" },
    { id: 2, icon: "fas fa-chalkboard-teacher", title: "Presentation Practice", desc: "Academic, Project Demo, Seminar", color: "#7209b7" },
    { id: 3, icon: "fas fa-bullhorn", title: "Public Speaking", desc: "Stage Speech, Debate, Group Discussion", color: "#f77f00" },
    { id: 4, icon: "fas fa-project-diagram", title: "Experience Explanation", desc: "Internship, Project, Work experience", color: "#4cc9a8" },
    { id: 5, icon: "fas fa-clipboard-check", title: "Answer Evaluation", desc: "Short/Long answer assessment", color: "#4361ee" },
    { id: 6, icon: "fas fa-comments", title: "Communication Skills", desc: "Fluency, Confidence, Pronunciation", color: "#7209b7" },
    { id: 7, icon: "fas fa-book-open", title: "Storytelling Practice", desc: "Narrative structure and delivery", color: "#f77f00" },
    { id: 8, icon: "fas fa-file-alt", title: "Resume Explanation", desc: "Portfolio and resume walkthrough", color: "#4cc9a8" },
    { id: 9, icon: "fas fa-question-circle", title: "Mock Q&A Practice", desc: "Practice questions and answers", color: "#4361ee" },
    { id: 10, icon: "fas fa-user", title: "Self-Introduction", desc: "Personal introduction practice", color: "#7209b7" },
    { id: 11, icon: "fas fa-graduation-cap", title: "Academic Explanation", desc: "Viva prep, Concept explanation", color: "#f77f00" },
    { id: 12, icon: "fas fa-cogs", title: "Custom Purpose", desc: "Define your own practice intent", color: "#4cc9a8" }
];

// Sample Chat Messages for Different Purposes
const sampleMessages = {
    "Interview Preparation": [
        { sender: "AI", content: "Can you introduce yourself and tell me about your background?" },
        { sender: "AI", content: "Why are you interested in this position at our company?" },
        { sender: "AI", content: "Tell me about a challenging project you worked on and how you handled it." }
    ],
    "Presentation Practice": [
        { sender: "AI", content: "Begin by introducing your presentation topic and objectives." },
        { sender: "AI", content: "Now explain the main points of your project." },
        { sender: "AI", content: "How would you handle questions from the audience about your methodology?" }
    ],
    "Communication Skills Improvement": [
        { sender: "AI", content: "Tell me about your day using clear and structured sentences." },
        { sender: "AI", content: "Describe a complex concept in simple terms." },
        { sender: "AI", content: "Practice expressing your opinion on a current topic clearly." }
    ]
};

// Initialize the application
function initApp() {
    loadUsersFromStorage();
    checkExistingSession();
    setupEventListeners();
    
    // Set tab indicator position
    updateTabIndicator();
}

// User Management Functions
function loadUsersFromStorage() {
    if (!localStorage.getItem(USER_STORAGE_KEY)) {
        // Initialize with a sample user
        const sampleUsers = [
            {
                id: 1,
                name: "John Smith",
                email: "john@example.com",
                password: "password123",
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sampleUsers));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function registerUser(name, email, password) {
    const users = getUsers();
    
    // Check if user already exists
    if (findUserByEmail(email)) {
        return { success: false, message: "User with this email already exists" };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In real app, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, user: newUser };
}

function loginUser(email, password) {
    const user = findUserByEmail(email);
    
    if (!user) {
        return { success: false, message: "User not found. Please register first." };
    }
    
    if (user.password !== password) {
        return { success: false, message: "Incorrect password. Please try again." };
    }
    
    return { success: true, user: user };
}

function saveCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

function checkExistingSession() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User is already logged in
        authContainer.style.display = 'none';
        dashboardContainer.style.display = 'flex';
        currentUserName.textContent = currentUser.name;
        showToast(`Welcome back, ${currentUser.name}!`);
        loadHistory();
        loadPurposeCards();
    }
}

// Load practice history with enhanced UI
function loadHistory() {
    historyList.innerHTML = '';
    practiceHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        if (item.status === 'active') {
            historyItem.classList.add('active');
        }
        
        const statusClass = item.status === 'active' ? 'status-active' : 'status-pending';
        const statusText = item.status === 'active' ? 'Active' : 'Completed';
        
        historyItem.innerHTML = `
            <div class="history-title">${item.title}</div>
            <div class="history-date">
                <i class="far fa-calendar"></i> ${item.date} • <i class="far fa-clock"></i> ${item.duration}
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="history-purpose">${item.purpose}</div>
        `;
        historyItem.addEventListener('click', () => {
            document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
            historyItem.classList.add('active');
            loadSession(item.id);
        });
        historyList.appendChild(historyItem);
    });
}

// Load purpose selection cards with colors
function loadPurposeCards() {
    purposeGrid.innerHTML = '';
    practicePurposes.forEach(purpose => {
        const card = document.createElement('div');
        card.className = 'purpose-card';
        card.dataset.id = purpose.id;
        card.innerHTML = `
            <div class="purpose-icon">
                <i class="${purpose.icon}"></i>
            </div>
            <div class="purpose-title">${purpose.title}</div>
            <div class="purpose-desc">${purpose.desc}</div>
        `;
        
        // Set custom color for icon
        const iconElement = card.querySelector('.purpose-icon i');
        iconElement.style.background = `linear-gradient(135deg, ${purpose.color}, ${purpose.color}99)`;
        iconElement.style.webkitBackgroundClip = 'text';
        iconElement.style.webkitTextFillColor = 'transparent';
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.purpose-card').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            selectedPurpose = purpose.title;
            confirmPurposeBtn.disabled = false;
        });
        purposeGrid.appendChild(card);
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Auth Tab Switching with indicator animation
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        updateTabIndicator();
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        updateTabIndicator();
    });

    // Login
    loginBtn.addEventListener('click', handleLogin);

    // Register
    registerBtn.addEventListener('click', handleRegister);

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Input Method Switching
    textBtn.addEventListener('click', () => switchInputMethod('text'));
    fileBtn.addEventListener('click', () => switchInputMethod('file'));
    voiceBtn.addEventListener('click', () => switchInputMethod('voice'));

    // New Session Button
    newSessionBtn.addEventListener('click', () => {
        // Clear chat and start fresh
        chatArea.innerHTML = '';
        addMessage('ai', "Hello! I'm your AI practice assistant. I can help you improve your communication, presentation, and interview skills. How would you like to practice today?");
        sessionStatus.textContent = "Ready to Practice";
        sessionStatus.classList.remove('in-progress');
        isSessionActive = false;
        switchInputMethod('text');
    });

    // Submit Content
    submitBtn.addEventListener('click', handleSubmitContent);

    // Clear Input
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        fileList.innerHTML = '';
        switchInputMethod('text');
        // Show confirmation
        showToast('Input cleared successfully');
    });

    // Purpose Modal
    confirmPurposeBtn.addEventListener('click', startPracticeSession);
    cancelPurposeBtn.addEventListener('click', () => {
        purposeModal.classList.remove('active');
        selectedPurpose = null;
    });

    // File Upload
    browseFiles.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);

    // Voice Recording
    startRecordingBtn.addEventListener('click', startRecording);
    stopRecordingBtn.addEventListener('click', stopRecording);
    
    // Add drag and drop for file upload
    fileUploadUI.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadUI.style.borderColor = 'var(--primary-blue)';
        fileUploadUI.style.backgroundColor = 'var(--light-blue)';
    });
    
    fileUploadUI.addEventListener('dragleave', () => {
        fileUploadUI.style.borderColor = 'var(--border-gray)';
        fileUploadUI.style.backgroundColor = 'var(--white)';
    });
    
    fileUploadUI.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadUI.style.borderColor = 'var(--border-gray)';
        fileUploadUI.style.backgroundColor = 'var(--white)';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload({ target: fileInput });
        }
    });
}

// Update tab indicator position
function updateTabIndicator() {
    const activeTab = document.querySelector('.auth-tab.active');
    if (activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = document.querySelector('.auth-tabs').getBoundingClientRect();
        
        tabIndicator.style.left = (tabRect.left - containerRect.left) + 'px';
        tabIndicator.style.width = tabRect.width + 'px';
    }
}

// Handle Login with user validation
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let hasError = false;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.form-input').forEach(el => el.style.borderColor = 'var(--border-gray)');

    // Validation
    if (!email || !email.includes('@')) {
        document.getElementById('loginEmailError').style.display = 'block';
        document.getElementById('loginEmail').style.borderColor = 'var(--primary-red)';
        hasError = true;
    }

    if (!password) {
        document.getElementById('loginPasswordError').style.display = 'block';
        document.getElementById('loginPassword').style.borderColor = 'var(--primary-red)';
        hasError = true;
    }

    if (!hasError) {
        showLoading('Authenticating...');
        
        // Check credentials
        setTimeout(() => {
            const result = loginUser(email, password);
            
            if (result.success) {
                // Save user session
                saveCurrentUser(result.user);
                
                hideLoading();
                authContainer.style.display = 'none';
                dashboardContainer.style.display = 'flex';
                currentUserName.textContent = result.user.name;
                showToast('Login successful! Welcome back.');
                
                // Initialize dashboard
                loadHistory();
                loadPurposeCards();
            } else {
                hideLoading();
                showToast(result.message, 'error');
                document.getElementById('loginPasswordError').textContent = result.message;
                document.getElementById('loginPasswordError').style.display = 'block';
                document.getElementById('loginPassword').style.borderColor = 'var(--primary-red)';
            }
        }, 1000);
    }
}

// Handle Registration with user creation
function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    let hasError = false;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.form-input').forEach(el => el.style.borderColor = 'var(--border-gray)');

    // Validation
    if (!name) {
        document.getElementById('registerNameError').style.display = 'block';
        document.getElementById('registerName').style.borderColor = 'var(--primary-red)';
        hasError = true;
    }

    if (!email || !email.includes('@')) {
        document.getElementById('registerEmailError').style.display = 'block';
        document.getElementById('registerEmail').style.borderColor = 'var(--primary-red)';
        hasError = true;
    }

    if (!password || password.length < 6) {
        document.getElementById('registerPasswordError').style.display = 'block';
        document.getElementById('registerPassword').style.borderColor = 'var(--primary-red)';
        hasError = true;
    }

    if (!hasError) {
        showLoading('Creating your account...');
        
        // Register user
        setTimeout(() => {
            const result = registerUser(name, email, password);
            
            if (result.success) {
                // Save user session
                saveCurrentUser(result.user);
                
                hideLoading();
                authContainer.style.display = 'none';
                dashboardContainer.style.display = 'flex';
                currentUserName.textContent = result.user.name;
                showToast('Account created successfully! Welcome to AI Practice Pro.');
                
                // Initialize dashboard
                loadHistory();
                loadPurposeCards();
            } else {
                hideLoading();
                showToast(result.message, 'error');
                document.getElementById('registerEmailError').textContent = result.message;
                document.getElementById('registerEmailError').style.display = 'block';
                document.getElementById('registerEmail').style.borderColor = 'var(--primary-red)';
            }
        }, 1000);
    }
}

// Handle Logout
function handleLogout() {
    clearCurrentUser();
    dashboardContainer.style.display = 'none';
    authContainer.style.display = 'flex';
    
    // Clear forms
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    
    // Switch to login tab
    loginTab.click();
    
    showToast('Logged out successfully.');
}

// Switch between input methods with animation
function switchInputMethod(method) {
    currentInputMethod = method;
    
    // Update button states
    textBtn.classList.remove('active');
    fileBtn.classList.remove('active');
    voiceBtn.classList.remove('active');
    
    // Hide all input UIs
    textInputContainer.style.display = 'none';
    fileUploadUI.classList.remove('active');
    recordingUI.classList.remove('active');
    
    // Show selected input UI with animation
    if (method === 'text') {
        textBtn.classList.add('active');
        setTimeout(() => {
            textInputContainer.style.display = 'block';
        }, 10);
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Content';
        submitBtn.className = 'action-btn primary-btn';
    } else if (method === 'file') {
        fileBtn.classList.add('active');
        fileUploadUI.classList.add('active');
        submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Continue';
        submitBtn.className = 'action-btn success-btn';
    } else if (method === 'voice') {
        voiceBtn.classList.add('active');
        recordingUI.classList.add('active');
        submitBtn.innerHTML = '<i class="fas fa-play"></i> Start Practice';
        submitBtn.className = 'action-btn warning-btn';
        stopRecording();
    }
}

// Handle file upload with enhanced UI
function handleFileUpload(event) {
    fileList.innerHTML = '';
    const files = event.target.files;
    
    if (files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement('div');
        fileItem.style.cssText = `
            padding: 12px;
            background: var(--light-gray);
            border-radius: var(--radius-md);
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid var(--border-gray);
            transition: all var(--transition-normal);
        `;
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-file" style="color: var(--primary-blue);"></i>
                <div>
                    <div style="font-weight: 500;">${file.name}</div>
                    <div style="font-size: 12px; color: var(--medium-gray);">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
            </div>
            <div class="status-badge status-active" style="font-size: 11px;">Ready</div>
        `;
        fileList.appendChild(fileItem);
        
        // Add hover effect
        fileItem.addEventListener('mouseenter', () => {
            fileItem.style.transform = 'translateX(5px)';
            fileItem.style.boxShadow = 'var(--shadow-sm)';
        });
        fileItem.addEventListener('mouseleave', () => {
            fileItem.style.transform = 'translateX(0)';
            fileItem.style.boxShadow = 'none';
        });
    }
    
    // Show success message
    if (files.length === 1) {
        showToast(`1 file selected: ${files[0].name}`);
    } else {
        showToast(`${files.length} files selected`);
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Start voice recording with enhanced UI
async function startRecording() {
    if (isRecording) return;
    
    try {
        showLoading('Getting microphone access...');
        loadingMessage.textContent = 'Accessing microphone...';
        
        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
                channelCount: 1
            } 
        });
        
        hideLoading();
        
        // Set up media recorder
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
        });
        audioChunks = [];
        
        // Set up audio visualization
        setupAudioVisualization(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Display the recorded voice message
            displayVoiceMessage(audioUrl, recordingTime);
            
            // Clean up
            stopAudioVisualization();
            stream.getTracks().forEach(track => track.stop());
            
            // Show purpose selection after a delay
            setTimeout(() => {
                showPurposeModal();
            }, 1000);
        };
        
        // Start recording
        mediaRecorder.start(100); // Collect data every 100ms
        isRecording = true;
        recordingTime = 0;
        
        // Update UI
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
        recordingDot.style.display = 'block';
        recordingStatus.textContent = 'Recording...';
        recordingStatus.style.color = 'var(--primary-red)';
        recordingStatus.style.fontWeight = '600';
        
        // Update submit button
        submitBtn.innerHTML = '<i class="fas fa-stop"></i> Stop & Analyze';
        submitBtn.className = 'action-btn danger-btn';
        
        // Start timer
        recordingInterval = setInterval(() => {
            recordingTime++;
            const minutes = Math.floor(recordingTime / 60).toString().padStart(2, '0');
            const seconds = (recordingTime % 60).toString().padStart(2, '0');
            timer.textContent = `${minutes}:${seconds}`;
        }, 1000);
        
        showToast('Recording started. Speak clearly into your microphone.');
        
    } catch (error) {
        hideLoading();
        console.error('Error accessing microphone:', error);
        showToast('Could not access microphone. Please check permissions.', 'error');
    }
}

// Stop voice recording
function stopRecording() {
    if (!isRecording) return;
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    
    isRecording = false;
    clearInterval(recordingInterval);
    
    // Update UI
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
    recordingDot.style.display = 'none';
    recordingStatus.textContent = 'Recording complete';
    recordingStatus.style.color = 'var(--primary-green)';
    recordingStatus.style.fontWeight = '600';
    
    // Update submit button
    submitBtn.innerHTML = '<i class="fas fa-play"></i> Start Practice';
    submitBtn.className = 'action-btn warning-btn';
    
    showToast(`Recording stopped. Duration: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`);
}

// Set up audio visualization
function setupAudioVisualization(stream) {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Start animation
        animateVisualizer();
    } catch (error) {
        console.error('Error setting up audio visualization:', error);
    }
}

// Animate the voice visualizer
function animateVisualizer() {
    if (!analyser || !dataArray) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    // Update visualizer based on volume
    const volumePercentage = Math.min(average / 128, 1);
    voiceWave.style.transform = `translateX(${(1 - volumePercentage) * -100}%)`;
    
    // Add color variation based on volume
    const intensity = Math.floor(volumePercentage * 100);
    const hue = 200 + intensity * 0.5; // Blue to purple gradient
    voiceWave.style.background = `linear-gradient(90deg, hsl(${hue}, 80%, 60%) 0%, hsl(${hue + 20}, 80%, 60%) 100%)`;
    
    animationId = requestAnimationFrame(animateVisualizer);
}

// Stop audio visualization
function stopAudioVisualization() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    analyser = null;
    dataArray = null;
    voiceWave.style.transform = 'translateX(-100%)';
    voiceWave.style.background = 'var(--primary-gradient)';
}

// Display voice message in chat with enhanced UI
function displayVoiceMessage(audioUrl, duration) {
    const durationStr = `${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`;
    
    addMessage('user', `
        <div class="voice-message-content">
            <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-microphone" style="color: var(--primary-orange); font-size: 18px;"></i>
                <div>
                    <strong style="font-size: 16px;">Voice Recording</strong>
                    <div style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">Duration: ${durationStr}</div>
                </div>
            </div>
            <div class="voice-player">
                <audio controls style="width: 100%;">
                    <source src="${audioUrl}" type="audio/webm">
                    Your browser does not support the audio element.
                </audio>
                <button class="action-btn secondary-btn" onclick="downloadAudio('${audioUrl}')" style="padding: 8px 16px; font-size: 14px; white-space: nowrap;">
                    <i class="fas fa-download"></i> Save
                </button>
            </div>
        </div>
    `, 'voice');
}

// Download audio helper function
window.downloadAudio = function(audioUrl) {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `ai-practice-recording-${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Audio file downloaded');
};

// Handle content submission with enhanced UI
function handleSubmitContent() {
    if (currentInputMethod === 'voice') {
        // For voice input, we handle recording separately
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
        return;
    }

    let content = '';
    
    if (currentInputMethod === 'text') {
        content = textInput.value.trim();
        if (!content) {
            showToast('Please enter some text to practice.', 'error');
            textInput.focus();
            return;
        }
        addMessage('user', content);
        textInput.value = '';
    } else if (currentInputMethod === 'file') {
        const files = fileInput.files;
        if (files.length === 0) {
            showToast('Please select at least one file.', 'error');
            return;
        }
        content = `Uploaded ${files.length} file${files.length > 1 ? 's' : ''} for analysis.`;
        addMessage('user', content);
        fileList.innerHTML = '';
        fileInput.value = '';
    }

    // Show purpose selection modal
    setTimeout(() => {
        showPurposeModal();
    }, 500);
}

// Show purpose selection modal with animation
function showPurposeModal() {
    purposeModal.classList.add('active');
    selectedPurpose = null;
    confirmPurposeBtn.disabled = true;
    document.querySelectorAll('.purpose-card').forEach(el => el.classList.remove('selected'));
}

// Start practice session with enhanced UI
function startPracticeSession() {
    purposeModal.classList.remove('active');
    
    if (!selectedPurpose) {
        showToast('Please select a practice purpose.', 'error');
        return;
    }

    // Update session status
    isSessionActive = true;
    sessionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Practice in Progress';
    sessionStatus.classList.add('in-progress');

    // Add purpose confirmation message
    addMessage('ai', `
        <div style="margin-bottom: 10px;">
            <strong style="color: var(--primary-blue);">Purpose selected:</strong> ${selectedPurpose}
        </div>
        <p>I'll help you practice for this scenario. Let's begin!</p>
    `);

    // Start the practice session with relevant questions
    setTimeout(() => {
        startAIQuestioning();
    }, 1000);
    
    showToast(`Practice session started: ${selectedPurpose}`);
}

// Start AI questioning based on selected purpose
function startAIQuestioning() {
    const messages = sampleMessages[selectedPurpose] || sampleMessages["Interview Preparation"];
    
    // Ask first question
    if (messages && messages.length > 0) {
        setTimeout(() => {
            // Add typing indicator
            addTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator();
                addMessage('ai', messages[0].content);
                showVoiceResponseUI();
            }, 1500);
        }, 1000);
    }
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-sender">
            <div class="user-avatar ai-avatar">AI</div>
            AI Assistant
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Show voice response UI with enhanced design
function showVoiceResponseUI() {
    // Remove any existing response UI
    const existingResponseUI = document.getElementById('responseUI');
    if (existingResponseUI) existingResponseUI.remove();
    
    const responseUI = document.createElement('div');
    responseUI.className = 'response-ui active';
    responseUI.id = 'responseUI';
    responseUI.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <div style="width: 4px; height: 20px; background: var(--primary-orange); border-radius: var(--radius-full);"></div>
            <div style="font-weight: 700; color: var(--primary-orange); font-size: 16px;">Your Response:</div>
        </div>
        <div class="recording-controls">
            <div class="recording-info">
                <div class="recording-indicator">
                    <div class="recording-dot" id="responseRecordingDot" style="display: none;"></div>
                    <div class="timer" id="responseTimer">00:00</div>
                </div>
                <div id="responseRecordingStatus" style="font-weight: 500; color: var(--medium-gray);">Ready to respond</div>
            </div>
            <div class="recording-buttons">
                <button class="action-btn success-btn" id="responseStartBtn" style="padding: 12px 20px;">
                    <i class="fas fa-microphone"></i> Start Response
                </button>
                <button class="action-btn danger-btn" id="responseStopBtn" disabled style="padding: 12px 20px;">
                    <i class="fas fa-stop"></i> Stop
                </button>
                <button class="action-btn secondary-btn" id="skipResponseBtn" style="padding: 12px 20px;">
                    <i class="fas fa-forward"></i> Skip
                </button>
            </div>
        </div>
        <div style="font-size: 13px; color: var(--medium-gray); margin-top: 10px; text-align: center;">
            <i class="fas fa-info-circle"></i> Record your response to get personalized feedback
        </div>
    `;
    
    // Add CSS for response UI
    responseUI.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
        background: linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%);
        border-radius: var(--radius-lg);
        margin-top: 20px;
        border: 2px solid var(--border-gray);
        animation: fadeInUp 0.5s ease;
    `;
    
    chatArea.appendChild(responseUI);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Response recording variables
    let responseMediaRecorder = null;
    let responseAudioChunks = [];
    let responseTime = 0;
    let responseInterval = null;
    let isResponseRecording = false;
    
    // Event listeners for response buttons
    responseUI.querySelector('#responseStartBtn').addEventListener('click', async () => {
        if (isResponseRecording) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                } 
            });
            responseMediaRecorder = new MediaRecorder(stream);
            responseAudioChunks = [];
            
            responseMediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    responseAudioChunks.push(event.data);
                }
            };
            
            responseMediaRecorder.onstop = () => {
                const audioBlob = new Blob(responseAudioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Display response
                const durationStr = `${Math.floor(responseTime / 60).toString().padStart(2, '0')}:${(responseTime % 60).toString().padStart(2, '0')}`;
                
                addMessage('user', `
                    <div class="voice-message-content">
                        <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-microphone" style="color: var(--primary-orange); font-size: 18px;"></i>
                            <div>
                                <strong style="font-size: 16px;">Practice Response</strong>
                                <div style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">Duration: ${durationStr}</div>
                            </div>
                        </div>
                        <div class="voice-player">
                            <audio controls style="width: 100%;">
                                <source src="${audioUrl}" type="audio/webm">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                `, 'voice');
                
                // Clean up
                stream.getTracks().forEach(track => track.stop());
                
                // Remove response UI
                responseUI.remove();
                
                // Provide AI feedback after a delay
                setTimeout(() => {
                    addTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        provideAIFeedback();
                    }, 2000);
                }, 1000);
            };
            
            responseMediaRecorder.start(100);
            isResponseRecording = true;
            responseTime = 0;
            
            // Update UI
            responseUI.querySelector('#responseStartBtn').disabled = true;
            responseUI.querySelector('#responseStopBtn').disabled = false;
            responseUI.querySelector('#responseRecordingDot').style.display = 'block';
            responseUI.querySelector('#responseRecordingStatus').textContent = 'Recording response...';
            responseUI.querySelector('#responseRecordingStatus').style.color = 'var(--primary-red)';
            responseUI.querySelector('#responseRecordingStatus').style.fontWeight = '600';
            responseUI.querySelector('#skipResponseBtn').disabled = true;
            
            // Start timer
            responseInterval = setInterval(() => {
                responseTime++;
                const minutes = Math.floor(responseTime / 60).toString().padStart(2, '0');
                const seconds = (responseTime % 60).toString().padStart(2, '0');
                responseUI.querySelector('#responseTimer').textContent = `${minutes}:${seconds}`;
            }, 1000);
            
        } catch (error) {
            console.error('Error recording response:', error);
            showToast('Could not access microphone for response.', 'error');
        }
    });
    
    responseUI.querySelector('#responseStopBtn').addEventListener('click', () => {
        if (!isResponseRecording) return;
        
        if (responseMediaRecorder && responseMediaRecorder.state !== 'inactive') {
            responseMediaRecorder.stop();
        }
        
        isResponseRecording = false;
        clearInterval(responseInterval);
        
        // Update UI
        responseUI.querySelector('#responseRecordingDot').style.display = 'none';
        responseUI.querySelector('#responseRecordingStatus').textContent = 'Response recorded';
        responseUI.querySelector('#responseRecordingStatus').style.color = 'var(--primary-green)';
        responseUI.querySelector('#responseRecordingStatus').style.fontWeight = '600';
    });
    
    responseUI.querySelector('#skipResponseBtn').addEventListener('click', () => {
        if (responseMediaRecorder && isResponseRecording) {
            responseMediaRecorder.stop();
            clearInterval(responseInterval);
        }
        
        responseUI.remove();
        addMessage('user', 'Skipped this question.');
        
        // Move to next question
        setTimeout(() => {
            addTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessage('ai', 'No problem. Let me ask another question...');
                setTimeout(() => {
                    addTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        addMessage('ai', 'What motivated you to apply for this position?');
                        showVoiceResponseUI();
                    }, 1500);
                }, 1000);
            }, 1500);
        }, 1000);
    });
}

// Provide AI feedback with enhanced UI
function provideAIFeedback() {
    const feedbackMessage = document.createElement('div');
    feedbackMessage.className = 'message ai-message';
    feedbackMessage.innerHTML = `
        <div class="message-sender">
            <div class="user-avatar ai-avatar">AI</div>
            AI Assistant
        </div>
        <div class="message-content">
            <p>Thank you for your response. Here's my feedback:</p>
            <div class="feedback-section">
                <div class="feedback-title">
                    <i class="fas fa-chart-line" style="color: var(--primary-orange);"></i>
                    Performance Analysis
                </div>
                <div class="feedback-item">
                    <i class="fas fa-check-circle" style="color: var(--primary-green);"></i>
                    <div>
                        <strong>Content:</strong> Relevant and well-structured answer
                        <div style="font-size: 13px; color: var(--medium-gray); margin-top: 2px;">You addressed the question directly with good examples.</div>
                    </div>
                </div>
                <div class="feedback-item">
                    <i class="fas fa-check-circle" style="color: var(--primary-green);"></i>
                    <div>
                        <strong>Clarity:</strong> Clear communication of your experience
                        <div style="font-size: 13px; color: var(--medium-gray); margin-top: 2px;">Good pacing and articulation throughout.</div>
                    </div>
                </div>
                <div class="feedback-item">
                    <i class="fas fa-exclamation-triangle" style="color: var(--primary-orange);"></i>
                    <div>
                        <strong>Improvement:</strong> Try to be more specific about projects
                        <div style="font-size: 13px; color: var(--medium-gray); margin-top: 2px;">Add more details about your role and outcomes.</div>
                    </div>
                </div>
                <div class="feedback-item">
                    <i class="fas fa-lightbulb" style="color: var(--primary-blue);"></i>
                    <div>
                        <strong>Tip:</strong> Include metrics when describing achievements
                        <div style="font-size: 13px; color: var(--medium-gray); margin-top: 2px;">Numbers help quantify your impact (e.g., "increased efficiency by 20%").</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px; padding: 12px; background-color: var(--light-blue); border-radius: var(--radius-md);">
                <strong>Overall Score:</strong> <span style="color: var(--primary-blue); font-weight: 700;">8.5/10</span>
                <div style="font-size: 14px; margin-top: 5px;">Great job! Keep practicing to refine your delivery.</div>
            </div>
        </div>
        <div class="message-time">Just now</div>
    `;
    
    chatArea.appendChild(feedbackMessage);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Ask follow-up question
    setTimeout(() => {
        addTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addMessage('ai', 'Excellent progress! Now, can you tell me about a challenging project you worked on?');
            showVoiceResponseUI();
        }, 2000);
    }, 3000);
}

// Add message to chat with avatar
function addMessage(sender, content, type = 'text') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${type === 'voice' ? 'voice-message' : ''}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const avatarClass = sender === 'ai' ? 'ai-avatar' : 'user-avatar-bg';
    const avatarText = sender === 'ai' ? 'AI' : 'YOU';
    
    messageDiv.innerHTML = `
        <div class="message-sender">
            <div class="user-avatar ${avatarClass}">${avatarText}</div>
            ${sender === 'ai' ? 'AI Assistant' : 'You'}
        </div>
        <div class="message-content">${content}</div>
        <div class="message-time">${time}</div>
    `;
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Load a previous session
function loadSession(sessionId) {
    // Clear current chat
    chatArea.innerHTML = '';
    
    // Add session loaded message
    addMessage('ai', `
        <div style="margin-bottom: 10px;">
            <strong>Loaded previous practice session:</strong> ${practiceHistory.find(h => h.id === sessionId).title}
        </div>
        <p>This was a <strong>${practiceHistory.find(h => h.id === sessionId).purpose}</strong> session.</p>
    `);
    
    // Add sample messages from that session
    setTimeout(() => {
        addTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addMessage('ai', 'This was the first question from that session:');
            setTimeout(() => {
                addMessage('ai', 'Can you introduce yourself and your background?');
                setTimeout(() => {
                    addMessage('user', 'I am a recent computer science graduate with internship experience at two tech startups.');
                    setTimeout(() => {
                        addMessage('ai', 'Good start! Remember to mention specific skills and projects.');
                        showToast('Session loaded successfully');
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1500);
    }, 1000);
}

// Show loading overlay with custom message
function showLoading(message) {
    loadingMessage.textContent = message;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Initialize the app
initApp();