let currentUser = null;
let isGuest = false;

document.addEventListener('DOMContentLoaded', function() {
  const savedUser = localStorage.getItem('vaultofcodes_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMainApp();
  } else {
    showLandingPage();
  }
  
  initializeApp();
  initializeAnimations();
});

// Initialize animations and interactive effects
function initializeAnimations() {
  // Add scroll progress indicator
  addScrollProgressIndicator();
  
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Typing effect for hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    initTypingEffect(heroTitle);
  }

  // Add magnetic effect to cards
  addMagneticEffect();

  // Add ripple effect to buttons
  addRippleEffect();

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        
        // Animate counters when stats section is visible
        if (entry.target.classList.contains('hero-stats')) {
          animateCounters();
        }
      }
    });
  }, observerOptions);

  // Observe elements for animations
  document.querySelectorAll('.feature-card, .hero-stats, .features-preview h2').forEach(el => {
    observer.observe(el);
  });

  // Add floating effect to visual elements
  addFloatingAnimation();
  
  // Add sparkle effects
  addSparkleEffects();
}

// Scroll progress indicator
function addScrollProgressIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = '<div class="scroll-progress"></div>';
  document.body.appendChild(indicator);

  window.addEventListener('scroll', function() {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
  });
}

// Magnetic effect for cards
function addMagneticEffect() {
  const cards = document.querySelectorAll('.feature-card, .stat-item');
  
  cards.forEach(card => {
    card.classList.add('magnetic');
    
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.1;
      const moveY = y * 0.1;
      
      card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${moveY * 0.1}deg) rotateY(${moveX * 0.1}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'translate3d(0, 0, 0) rotateX(0) rotateY(0)';
    });
  });
}

// Ripple effect for buttons
function addRippleEffect() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  buttons.forEach(button => {
    button.classList.add('ripple');
  });
}

// Add sparkle effects to special elements
function addSparkleEffects() {
  const specialElements = document.querySelectorAll('.gradient-text, .feature-icon');
  
  specialElements.forEach(element => {
    element.classList.add('sparkle');
  });
}

// Typing effect
function initTypingEffect(element) {
  const text = element.textContent;
  element.textContent = '';
  element.style.borderRight = '2px solid var(--primary-600)';
  
  let i = 0;
  const timer = setInterval(function() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      setTimeout(() => {
        element.style.borderRight = 'none';
      }, 1000);
    }
  }, 100);
}

// Animated counters
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
    const suffix = counter.textContent.replace(/\d/g, '');
    let current = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + suffix;
      }
    }, 50);
  });
}

// Floating animation for hero visual elements
function addFloatingAnimation() {
  const floatingElements = document.querySelectorAll('.floating-card, .hero-visual img');
  
  floatingElements.forEach((element, index) => {
    element.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
  });
}

// Add CSS for floating animation
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;
document.head.appendChild(floatingStyle);

function openAuthModal(type = 'login') {
  const modal = document.getElementById('authModal');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (type === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
  } else {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function switchToLogin() {
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('signupForm').classList.remove('active');
}

function switchToSignup() {
  document.getElementById('signupForm').classList.add('active');
  document.getElementById('loginForm').classList.remove('active');
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (email && password) {
    currentUser = {
      id: Date.now(),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email,
      role: 'Premium User',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('vaultofcodes_user', JSON.stringify(currentUser));
    closeAuthModal();
    showMainApp();
    showToast('✅ Welcome back! Login successful', 'success');
  } else {
    showToast('⚠️ Please fill in all fields', 'warning');
  }
}

function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  if (name && email && password) {
    currentUser = {
      id: Date.now(),
      name,
      email,
      role: 'Premium User',
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('vaultofcodes_user', JSON.stringify(currentUser));
    closeAuthModal();
    showMainApp();
    showToast('🎉 Account created successfully! Welcome to VaultofCodes', 'success');
  } else {
    showToast('⚠️ Please fill in all fields', 'warning');
  }
}

function enterAsGuest() {
  isGuest = true;
  currentUser = {
    name: 'Guest User',
    email: null,
    role: 'Guest Access',
    isGuest: true
  };
  closeAuthModal();
  showMainApp();
  showToast('👋 Welcome! You\'re browsing as a guest', 'info');
}

function logout() {
  closeAllDropdowns();
  currentUser = null;
  isGuest = false;
  localStorage.removeItem('vaultofcodes_user');
  showLandingPage();
  showToast('👋 You\'ve been logged out successfully', 'info');
}

function showLandingPage() {
  document.querySelector('#landingPage').classList.remove('hidden');
  document.querySelector('#mainApp').classList.add('hidden');
}

function showMainApp() {
  document.querySelector('#landingPage').classList.add('hidden');
  document.querySelector('#mainApp').classList.remove('hidden');
  
  updateUserInterface();
}

function updateUserInterface() {
  const profileName = document.getElementById('profileName');
  const dropdownUserName = document.getElementById('dropdownUserName');
  const dropdownUserRole = document.getElementById('dropdownUserRole');
  const dashboardLink = document.getElementById('dashboardLink');
  const profileDashboardLink = document.getElementById('profileDashboardLink');
  const dashboardSection = document.getElementById('dashboard');
  
  if (currentUser) {
    // Update profile display
    profileName.textContent = currentUser.name;
    dropdownUserName.textContent = currentUser.name;
    dropdownUserRole.textContent = currentUser.role;
    
    if (currentUser.isGuest) {
      // Add guest mode class to body
      document.body.classList.add('guest-mode');
      document.body.classList.remove('auth-mode');
      
      // Hide dashboard completely for guest users
      if (dashboardLink) dashboardLink.style.display = 'none';
      if (profileDashboardLink) profileDashboardLink.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'none';
      
      // Show a toast message about limited features
      showToast('👤 Guest Mode: Sign up to access dashboard and track your progress!', 'info');
    } else {
      // Add authenticated mode class to body
      document.body.classList.add('auth-mode');
      document.body.classList.remove('guest-mode');
      
      // Show dashboard for logged-in users
      if (dashboardLink) {
        dashboardLink.style.display = 'block';
        dashboardLink.style.opacity = '1';
        dashboardLink.style.pointerEvents = 'auto';
      }
      if (profileDashboardLink) {
        profileDashboardLink.style.display = 'flex';
      }
      if (dashboardSection) {
        dashboardSection.style.display = 'block';
      }
    }
  }
}

function showUpgradePrompt() {
  if (isGuest) {
    if (confirm('Create an account to access all premium features including:\n\n• Personal Dashboard & Analytics\n• Course Progress Tracking\n• Certificate Downloads\n• Internship Applications\n• Achievement System\n\nWould you like to create an account now?')) {
      openAuthModal('signup');
    }
  }
}

// Profile Dropdown Functions
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  const isActive = dropdown.classList.contains('active');
  
  // Close any open dropdowns first
  closeAllDropdowns();
  
  if (!isActive) {
    dropdown.classList.add('active');
    // Close dropdown when clicking outside
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);
  }
}

function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.profile-dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('active');
  });
  document.removeEventListener('click', handleOutsideClick);
}

function handleOutsideClick(event) {
  const dropdown = document.getElementById('profileDropdown');
  if (!dropdown.contains(event.target)) {
    closeAllDropdowns();
  }
}

function openSettings() {
  closeAllDropdowns();
  showToast('⚙️ Settings panel coming soon!', 'info');
}

function openProfile() {
  closeAllDropdowns();
  
  // Hide main app and show profile section
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('profile').classList.remove('hidden');
  
  // Initialize profile with user data
  initializeProfileData();
  
  showToast('📝 Profile editor opened', 'info');
}

function closeProfile() {
  document.getElementById('profile').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  
  // Remove body class to show sections again
  document.body.classList.remove('profile-active');
}

function initializeProfileData() {
  if (currentUser && !currentUser.isGuest) {
    // Populate form fields with existing user data
    const nameParts = currentUser.name.split(' ');
    document.getElementById('firstName').value = nameParts[0] || '';
    document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
    document.getElementById('email').value = currentUser.email || '';
  }
}

// Profile Navigation
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('profile-nav-item') || e.target.closest('.profile-nav-item')) {
    e.preventDefault();
    const navItem = e.target.classList.contains('profile-nav-item') ? e.target : e.target.closest('.profile-nav-item');
    const tabName = navItem.dataset.tab;
    
    // Update active navigation
    document.querySelectorAll('.profile-nav-item').forEach(item => item.classList.remove('active'));
    navItem.classList.add('active');
    
    // Show corresponding tab
    document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-content="${tabName}"]`).classList.add('active');
  }
});

// Form Functions
function savePersonalInfo(event) {
  event.preventDefault();
  
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const bio = document.getElementById('bio').value;
  const location = document.getElementById('location').value;
  const website = document.getElementById('website').value;
  
  if (firstName && lastName && email) {
    // Update current user data
    if (currentUser) {
      currentUser.name = `${firstName} ${lastName}`;
      currentUser.email = email;
      currentUser.phone = phone;
      currentUser.bio = bio;
      currentUser.location = location;
      currentUser.website = website;
      
      // Save to localStorage
      localStorage.setItem('vaultofcodes_user', JSON.stringify(currentUser));
      
      // Update UI
      updateUserInterface();
    }
    
    showToast('✅ Profile updated successfully!', 'success');
  } else {
    showToast('⚠️ Please fill in required fields', 'warning');
  }
}

function resetPersonalForm() {
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('bio').value = '';
  document.getElementById('location').value = '';
  document.getElementById('website').value = '';
  
  showToast('� Form reset', 'info');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoContainer = document.querySelector('.profile-photo-large');
      photoContainer.innerHTML = `<img src="${e.target.result}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      showToast('📸 Profile photo updated!', 'success');
    };
    reader.readAsDataURL(file);
  }
}

// Skills Management
function addSkill(category) {
  const input = document.getElementById(`${category}Skill`);
  const skillText = input.value.trim();
  
  if (skillText) {
    const skillsContainer = document.getElementById(`${category}Skills`);
    const skillTag = document.createElement('div');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `
      <span>${skillText}</span>
      <button onclick="removeSkill(this)"><i class="fas fa-times"></i></button>
    `;
    
    skillsContainer.appendChild(skillTag);
    input.value = '';
    
    showToast(`✅ Added ${skillText} to your skills`, 'success');
  }
}

function addSkillOnEnter(event, category) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addSkill(category);
  }
}

function removeSkill(button) {
  const skillTag = button.closest('.skill-tag');
  const skillName = skillTag.querySelector('span').textContent;
  skillTag.remove();
  showToast(`🗑️ Removed ${skillName}`, 'info');
}

// Settings Functions
function openPasswordModal() {
  showToast('🔐 Password change feature coming soon!', 'info');
}

function toggleTwoFactor() {
  const toggle = document.getElementById('twoFactorToggle');
  if (toggle.checked) {
    showToast('🔐 Two-factor authentication enabled', 'success');
  } else {
    showToast('🔐 Two-factor authentication disabled', 'info');
  }
}

function updateVisibility() {
  const visibility = document.getElementById('accountVisibility').value;
  showToast(`👁️ Account visibility set to ${visibility}`, 'info');
}

function confirmDeleteAccount() {
  if (confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone.')) {
    showToast('❌ Account deletion feature coming soon!', 'warning');
  }
}

// Privacy Functions
function downloadData() {
  const userData = {
    profile: currentUser,
    timestamp: new Date().toISOString(),
    dataType: 'VaultofCodes User Data Export'
  };
  
  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `vaultofcodes-data-${Date.now()}.json`;
  link.click();
  
  showToast('📥 Your data has been downloaded', 'success');
}

function clearActivity() {
  if (confirm('Are you sure you want to clear your activity history?')) {
    showToast('🧹 Activity history cleared', 'info');
  }
}

// Bio character counter
document.addEventListener('input', function(e) {
  if (e.target.id === 'bio') {
    const bio = e.target.value;
    const counter = e.target.nextElementSibling;
    const count = bio.length;
    counter.textContent = `${count}/500 characters`;
    
    if (count > 500) {
      counter.style.color = 'var(--error-500)';
      e.target.style.borderColor = 'var(--error-500)';
    } else {
      counter.style.color = 'var(--neutral-500)';
      e.target.style.borderColor = 'var(--neutral-300)';
    }
  }
});

// Preferences Functions
function applyTheme() {
  const theme = document.getElementById('themeSelect').value;
  document.body.className = `theme-${theme}`;
  showToast(`🎨 Theme changed to ${theme}`, 'success');
}

function updateLanguage() {
  const language = document.getElementById('languageSelect').value;
  showToast(`🌐 Language set to ${language}`, 'info');
}

function savePreferences() {
  const theme = document.getElementById('themeSelect').value;
  const language = document.getElementById('languageSelect').value;
  const timezone = document.getElementById('timezoneSelect').value;
  
  const preferences = {
    theme,
    language,
    timezone,
    savedAt: new Date().toISOString()
  };
  
  localStorage.setItem('vaultofcodes_preferences', JSON.stringify(preferences));
  showToast('⚙️ Preferences saved successfully!', 'success');
}

// Notification Functions
function updateEmailNotifications() {
  const emailNotifs = document.getElementById('emailNotifications').checked;
  showToast(`📧 Email notifications ${emailNotifs ? 'enabled' : 'disabled'}`, 'info');
}

function updatePushNotifications() {
  const pushNotifs = document.getElementById('pushNotifications').checked;
  
  if (pushNotifs && 'Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showToast('🔔 Push notifications enabled', 'success');
      } else {
        document.getElementById('pushNotifications').checked = false;
        showToast('❌ Push notification permission denied', 'error');
      }
    });
  } else {
    showToast(`🔔 Push notifications ${pushNotifs ? 'enabled' : 'disabled'}`, 'info');
  }
}

function saveNotificationSettings() {
  const settings = {
    email: document.getElementById('emailNotifications').checked,
    push: document.getElementById('pushNotifications').checked,
    courses: document.getElementById('courseNotifications').checked,
    achievements: document.getElementById('achievementNotifications').checked,
    savedAt: new Date().toISOString()
  };
  
  localStorage.setItem('vaultofcodes_notifications', JSON.stringify(settings));
  showToast('🔔 Notification settings saved!', 'success');
}

// Initialize preferences and notifications from localStorage
function initializeUserSettings() {
  // Load preferences
  const savedPreferences = localStorage.getItem('vaultofcodes_preferences');
  if (savedPreferences) {
    const prefs = JSON.parse(savedPreferences);
    document.getElementById('themeSelect').value = prefs.theme || 'light';
    document.getElementById('languageSelect').value = prefs.language || 'en';
    document.getElementById('timezoneSelect').value = prefs.timezone || 'UTC';
    
    // Apply saved theme
    if (prefs.theme) {
      document.body.className = `theme-${prefs.theme}`;
    }
  }
  
  // Load notification settings
  const savedNotifications = localStorage.getItem('vaultofcodes_notifications');
  if (savedNotifications) {
    const notifs = JSON.parse(savedNotifications);
    document.getElementById('emailNotifications').checked = notifs.email || false;
    document.getElementById('pushNotifications').checked = notifs.push || false;
    document.getElementById('courseNotifications').checked = notifs.courses || true;
    document.getElementById('achievementNotifications').checked = notifs.achievements || true;
  }
}

// Call initialization when profile is opened
function openProfile() {
  closeAllDropdowns();
  
  // Hide main app and show profile section
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('profile').classList.remove('hidden');
  
  // Add body class to hide unwanted sections
  document.body.classList.add('profile-active');
  
  // Initialize profile with user data
  initializeProfileData();
  initializeUserSettings();
  
  showToast('📝 Profile editor opened', 'info');
}

function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    z-index: 9999;
    font-weight: 500;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 4000);
}

function verifyStudent() {
  const idInput = document.getElementById('identifier');
  const id = idInput.value.trim();
  const resultBox = document.getElementById('result');
  if (!id) {
    showToast('⚠️ Please enter a valid email or ID', 'warning');
    return;
  }
  showSpinner(true);
  setTimeout(() => {
    const student = generateStudentData(id);
    const html = createStudentCard(student);
    resultBox.innerHTML = html;
    showSpinner(false);
    showToast('✅ Student verification completed successfully', 'success');
    setTimeout(() => {
      animateProgress();
      initializeCharts(student);
    }, 300);
  }, 1500);
}

function generateStudentData(id) {
  const domains = ['Web Development', 'Data Science', 'Mobile App Development', 'Machine Learning', 'UI/UX Design'];
  const colleges = ['MIT', 'Stanford University', 'Harvard University', 'UC Berkeley', 'Carnegie Mellon'];
  const names = ['John Doe', 'Sarah Smith', 'Alex Johnson', 'Maria Garcia', 'David Chen'];
  const randomIndex = Math.floor(Math.random() * names.length);
  const completedAssignments = Math.floor(Math.random() * 4) + 1;
  return {
    name: names[randomIndex],
    email: id.includes('@') ? id : `${names[randomIndex].toLowerCase().replace(' ', '.')}@example.com`,
    mobile: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    domain: domains[randomIndex],
    college: colleges[randomIndex],
    startDate: "June 15, 2024",
    duration: "3 Months",
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[randomIndex]}`,
    assignments: [true, true, completedAssignments > 2, completedAssignments > 3],
    completionRate: Math.floor((completedAssignments / 4) * 100),
    status: completedAssignments === 4 ? 'Completed' : 'In Progress',
    certificate: completedAssignments === 4 ? "#certificate-link" : null,
    enrollmentId: `VOC${Math.floor(Math.random() * 10000)}`,
    performanceScore: Math.floor(Math.random() * 30) + 70,
    skillsProgress: {
      'Technical Skills': Math.floor(Math.random() * 40) + 60,
      'Project Management': Math.floor(Math.random() * 30) + 50,
      'Communication': Math.floor(Math.random() * 35) + 65,
      'Problem Solving': Math.floor(Math.random() * 25) + 75
    }
  };
}

function createStudentCard(student) {
  const assignmentItems = student.assignments.map((completed, index) => `
    <div class="assignment-item ${completed ? 'completed' : 'pending'}">
      <div class="assignment-icon">
        <i class="fas ${completed ? 'fa-check-circle' : 'fa-clock'}"></i>
      </div>
      <div class="assignment-label">Assignment ${index + 1}</div>
    </div>
  `).join('');
  const certificateSection = student.certificate ? `
    <div class="certificate-action">
      <div class="certificate-info">
        <div class="certificate-icon">
          <i class="fas fa-certificate"></i>
        </div>
        <div class="certificate-text">Certificate Available</div>
      </div>
      <a href="${student.certificate}" target="_blank" class="certificate-btn">
        <i class="fas fa-download"></i>
        Download Certificate
      </a>
    </div>
  ` : `
    <div class="certificate-action">
      <div class="certificate-info">
        <div class="certificate-icon">
          <i class="fas fa-hourglass-half"></i>
        </div>
        <div class="certificate-text">Certificate Pending</div>
      </div>
      <span style="color: var(--neutral-500); font-size: var(--font-size-sm);">Complete all assignments to unlock</span>
    </div>
  `;
  return `
    <div class="student-card">
      <div class="student-header">
        <img src="${student.photo}" alt="${student.name}" class="student-photo" />
        <div class="student-info">
          <h3 class="student-name">${student.name}</h3>
          <div class="student-domain">${student.domain}</div>
          <div class="student-details">
            <div class="detail-item">
              <i class="fas fa-envelope"></i>
              <span>${student.email}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-phone"></i>
              <span>${student.mobile}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-university"></i>
              <span>${student.college}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-calendar"></i>
              <span>${student.startDate}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <span>${student.duration}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-id-card"></i>
              <span>${student.enrollmentId}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="progress-section">
        <h4 class="progress-title">
          <i class="fas fa-chart-line"></i>
          Academic Progress
        </h4>
        <div class="assignment-grid">
          ${assignmentItems}
        </div>
        <div class="overall-progress">
          <span>Overall Completion:</span>
          <div class="progress-bar">
            <div class="progress-fill" data-progress="${student.completionRate}"></div>
          </div>
          <span class="progress-percentage">${student.completionRate}%</span>
        </div>
      </div>
      <div class="analytics-section">
        <h4 class="progress-title">
          <i class="fas fa-analytics"></i>
          Performance Analytics
        </h4>
        <div class="skills-chart-container">
          <canvas id="skillsChart" width="400" height="200"></canvas>
        </div>
        <div class="performance-metrics">
          <div class="metric-item">
            <div class="metric-value">${student.performanceScore}</div>
            <div class="metric-label">Performance Score</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${student.assignments.filter(a => a).length}/4</div>
            <div class="metric-label">Assignments Completed</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${student.status}</div>
            <div class="metric-label">Current Status</div>
          </div>
        </div>
      </div>
      ${certificateSection}
    </div>
  `;
}

function initializeCharts(student) {
  const ctx = document.getElementById('skillsChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.keys(student.skillsProgress),
      datasets: [{
        label: 'Skills Progress',
        data: Object.values(student.skillsProgress),
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: 'rgba(37, 99, 235, 0.8)',
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(37, 99, 235, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function animateProgress() {
  const progressFills = document.querySelectorAll('.progress-fill');
  progressFills.forEach(fill => {
    const progress = fill.getAttribute('data-progress');
    setTimeout(() => {
      fill.style.width = progress + '%';
    }, 100);
  });
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast-notification show ${type}`;
  setTimeout(() => {
    toast.className = 'toast-notification';
  }, 4000);
}

function showSpinner(show) {
  const spinner = document.querySelector('.spinner');
  if (show) {
    spinner.classList.remove('hidden');
  } else {
    spinner.classList.add('hidden');
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    threshold: 0.3
  });
  sections.forEach(section => observer.observe(section));
});

function addInteractiveFeatures() {
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  const qrBtn = document.querySelector('.quick-action-btn:first-child');
  const uploadBtn = document.querySelector('.quick-action-btn:last-child');
  if (qrBtn) {
    qrBtn.addEventListener('click', function() {
      showToast('📱 QR Scanner feature coming soon!', 'info');
    });
  }
  if (uploadBtn) {
    uploadBtn.addEventListener('click', function() {
      showToast('📄 Upload feature coming soon!', 'info');
    });
  }
}
document.addEventListener('DOMContentLoaded', addInteractiveFeatures);
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    verifyStudent();
  }
  if (e.key === 'Escape') {
    const resultBox = document.getElementById('result');
    if (resultBox.innerHTML.trim()) {
      resultBox.innerHTML = '';
      showToast('🗑️ Results cleared', 'info');
    }
  }
});
const additionalStyles = `
  .analytics-section {
    background: var(--neutral-50);
    padding: var(--space-6);
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-6);
  }
  .skills-chart-container {
    height: 300px;
    margin-bottom: var(--space-6);
    background: white;
    border-radius: var(--radius-lg);
    padding: var(--space-4);
  }
  .performance-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-4);
  }
  .metric-item {
    background: white;
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    text-align: center;
    border: 2px solid var(--neutral-200);
  }
  .metric-value {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--space-1);
  }
  .metric-label {
    font-size: var(--font-size-sm);
    color: var(--neutral-600);
    font-weight: 500;
  }
  .toast-notification.info::before {
    content: 'ℹ️';
  }
  .toast-notification.warning::before {
    content: '⚠️';
  }
  .toast-notification.error::before {
    content: '❌';
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

function initializeCourseFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filterValue = this.getAttribute('data-filter');
      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  const enrollBtns = document.querySelectorAll('.enroll-btn');
  enrollBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const courseTitle = this.closest('.course-card').querySelector('.course-title').textContent;
      showToast(`🎓 Enrolled in ${courseTitle}!`, 'success');
      this.textContent = 'Enrolled';
      this.style.background = 'var(--success-500)';
      this.disabled = true;
    });
  });
}

function initializeInternshipFilters() {
  const filterSelects = document.querySelectorAll('.filter-select');
  const internshipCards = document.querySelectorAll('.internship-card');
  filterSelects.forEach(select => {
    select.addEventListener('change', function() {
      filterInternships();
    });
  });
  function filterInternships() {
    const companyFilter = document.getElementById('companyFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const domainFilter = document.getElementById('domainFilter').value;
    internshipCards.forEach(card => {
      const company = card.getAttribute('data-company');
      const location = card.getAttribute('data-location');
      const domain = card.getAttribute('data-domain');
      const showCard = (companyFilter === 'all' || company === companyFilter) &&
                      (locationFilter === 'all' || location === locationFilter) &&
                      (domainFilter === 'all' || domain === domainFilter);
      card.style.display = showCard ? 'block' : 'none';
    });
  }
  const applyBtns = document.querySelectorAll('.apply-btn');
  applyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const companyName = this.closest('.internship-card').querySelector('.company-name').textContent;
      const position = this.closest('.internship-card').querySelector('.internship-title').textContent;
      showToast(`📝 Applied to ${position} at ${companyName}!`, 'success');
      this.textContent = 'Applied';
      this.style.background = 'var(--success-500)';
      this.disabled = true;
    });
  });
}

function initializeDashboard() {
  const navBtns = document.querySelectorAll('.dash-nav-btn');
  const contentSections = document.querySelectorAll('.dashboard-content');
  navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      navBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const tabName = this.getAttribute('data-tab');
      contentSections.forEach(section => {
        section.classList.remove('active');
      });
      const targetSection = document.querySelector(`[data-content="${tabName}"]`);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      if (tabName === 'analytics') {
        setTimeout(() => {
          initializeDashboardCharts();
        }, 100);
      }
    });
  });
  const continueBtns = document.querySelectorAll('.continue-btn');
  continueBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      showToast('🚀 Continuing your learning journey!', 'success');
    });
  });
  const certificateBtns = document.querySelectorAll('.certificate-btn');
  certificateBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      showToast('📜 Certificate downloaded!', 'success');
    });
  });
  const recBtns = document.querySelectorAll('.rec-btn');
  recBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const recTitle = this.closest('.recommendation-item').querySelector('h4').textContent;
      showToast(`✨ Exploring ${recTitle}!`, 'info');
    });
  });
}

function initializeDashboardCharts() {
  const performanceCtx = document.getElementById('performanceChart');
  if (performanceCtx) {
    new Chart(performanceCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Learning Progress',
          data: [65, 70, 75, 82, 88, 92],
          borderColor: 'rgba(37, 99, 235, 1)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  const skillCtx = document.getElementById('skillDevelopmentChart');
  if (skillCtx) {
    new Chart(skillCtx, {
      type: 'doughnut',
      data: {
        labels: ['JavaScript', 'Python', 'React', 'Node.js', 'Database'],
        datasets: [{
          data: [90, 85, 75, 70, 65],
          backgroundColor: [
            'rgba(37, 99, 235, 0.8)',
            'rgba(124, 58, 237, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}

function animateProgressRings() {
  const progressRings = document.querySelectorAll('.progress-ring');
  progressRings.forEach(ring => {
    const progress = parseInt(ring.getAttribute('data-progress'));
    const percentage = (progress / 100) * 360;
    ring.style.background = `conic-gradient(var(--primary-600) ${percentage}deg, var(--neutral-200) ${percentage}deg)`;
  });
}

function initializeAchievements() {
  const achievementCards = document.querySelectorAll('.achievement-card.earned');
  achievementCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = 'achievementPulse 0.6s ease-out';
    }, index * 200);
  });
}

function enhanceSearchFeatures() {
  const searchInput = document.getElementById('identifier');
  if (searchInput) {
    const suggestions = [
      'john.doe@example.com',
      'sarah.smith@university.edu',
      'alex.johnson@college.edu',
      'VOC001', 'VOC002', 'VOC003'
    ];
    searchInput.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      if (value.length > 2) {
        const matches = suggestions.filter(s => s.toLowerCase().includes(value));
      }
    });
  }
}


document.addEventListener('DOMContentLoaded', function() {
  addInteractiveFeatures();
  initializeCourseFilters();
  initializeInternshipFilters();
  initializeDashboard();
  enhanceSearchFeatures();
  setTimeout(() => {
    animateProgressRings();
    initializeAchievements();
  }, 1000);
});
