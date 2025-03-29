// Profile management functionality for TaskEase
document.addEventListener('DOMContentLoaded', function() {
    // Load user profile data
    loadProfile();
    
    // Set up event listeners
    setupProfileEventListeners();
});

function loadProfile() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = '../auth/login.html';
        return;
    }
    
    // In a real app, this would fetch from backend API
    const profileData = mockGetProfile(currentUser.email);
    
    // Update profile UI
    updateProfileUI(profileData);
}

function setupProfileEventListeners() {
    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            toggleEditMode(true);
        });
    }
    
    // Save profile button (would be shown in edit mode)
    const saveProfileBtn = document.querySelector('.save-profile-btn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            saveProfile();
        });
    }
}

function updateProfileUI(profileData) {
    // Basic info
    document.querySelector('.profile-name').textContent = profileData.name;
    document.querySelector('.profile-role').textContent = profileData.accountType === 'taskWorker' ? 'Task Worker' : 'Task Poster';
    
    // Contact info
    document.querySelector('.profile-email').textContent = profileData.email;
    document.querySelector('.profile-phone').textContent = profileData.phone || 'Not provided';
    document.querySelector('.profile-location').textContent = profileData.location || 'Not provided';
    
    // Account details
    document.querySelector('.profile-member-since').textContent = `Member since ${profileData.memberSince}`;
    document.querySelector('.profile-verification').textContent = profileData.verified ? 'Identity Verified' : 'Not Verified';
    
    // About section
    document.querySelector('.profile-about').textContent = profileData.about || 'No description provided';
    
    // Skills
    const skillsContainer = document.querySelector('.profile-skills');
    if (skillsContainer && profileData.skills) {
        skillsContainer.innerHTML = profileData.skills.map(skill => `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                ${skill}
            </span>
        `).join('');
    }
    
    // Rating
    const ratingElement = document.querySelector('.profile-rating');
    if (ratingElement && profileData.rating) {
        ratingElement.innerHTML = `
            <i class="fas fa-star text-yellow-400 mr-1"></i> ${profileData.rating.toFixed(1)}
        `;
    }
}

function toggleEditMode(enable) {
    const profileForm = document.getElementById('profileForm');
    const viewModeElements = document.querySelectorAll('.view-mode');
    const editModeElements = document.querySelectorAll('.edit-mode');
    
    if (enable) {
        // Switch to edit mode
        viewModeElements.forEach(el => el.classList.add('hidden'));
        editModeElements.forEach(el => el.classList.remove('hidden'));
        
        // Initialize form with current values
        const currentUser = getCurrentUser();
        const profileData = mockGetProfile(currentUser.email);
        
        if (profileForm) {
            profileForm.elements['name'].value = profileData.name;
            profileForm.elements['phone'].value = profileData.phone || '';
            profileForm.elements['location'].value = profileData.location || '';
            profileForm.elements['about'].value = profileData.about || '';
        }
    } else {
        // Switch back to view mode
        viewModeElements.forEach(el => el.classList.remove('hidden'));
        editModeElements.forEach(el => el.classList.add('hidden'));
    }
}

function saveProfile() {
    const profileForm = document.getElementById('profileForm');
    const updatedProfile = {
        name: profileForm.elements['name'].value,
        phone: profileForm.elements['phone'].value,
        location: profileForm.elements['location'].value,
        about: profileForm.elements['about'].value
    };
    
    // Show loading state
    const saveButton = document.querySelector('.save-profile-btn');
    const originalText = saveButton.innerHTML;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
    
    // Mock save to backend
    setTimeout(() => {
        // In a real app, this would call your backend API
        mockUpdateProfile(updatedProfile);
        
        // Show success message
        showProfileMessage('Profile updated successfully!', 'success');
        
        // Exit edit mode
        toggleEditMode(false);
        
        // Reload profile data
        loadProfile();
        
        // Reset button
        saveButton.disabled = false;
        saveButton.innerHTML = originalText;
    }, 1000);
}

// Mock profile data functions
function mockGetProfile(email) {
    // In a real app, this would fetch from your backend
    return {
        email: email,
        name: 'John Doe',
        accountType: 'taskWorker',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        memberSince: 'June 2023',
        verified: true,
        about: 'Experienced task worker with a focus on quality service. I specialize in shopping, errands, and light cleaning. Available weekdays from 9am to 5pm. Let me help make your life easier!',
        skills: ['Grocery Shopping', 'Dry Cleaning', 'Home Organization', 'Pet Care'],
        rating: 4.8,
        completedTasks: 42
    };
}

function mockUpdateProfile(updatedData) {
    // In a real app, this would update your backend
    console.log('Profile updated:', updatedData);
    return { success: true };
}

function showProfileMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.profile-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and display new message
    const messageElement = document.createElement('div');
    messageElement.className = `profile-message ${type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' : 'bg-green-50 border-l-4 border-green-500 text-green-700'} p-4 mb-4`;
    messageElement.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle text-red-500' : 'fa-check-circle text-green-500'}"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm">${message}</p>
            </div>
        </div>
    `;
    
    // Insert message at the top of the profile section
    const profileSection = document.querySelector('main');
    profileSection.insertBefore(messageElement, profileSection.firstChild);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProfile,
        updateProfileUI,
        mockGetProfile,
        mockUpdateProfile
    };
}