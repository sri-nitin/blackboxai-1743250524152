// Core application functionality for TaskEase
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Check for geolocation support
    if (navigator.geolocation) {
        getLocation();
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    // Set up event listeners
    setupEventListeners();
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            localStorage.setItem('userLocation', JSON.stringify(userLocation));
            console.log("User location stored:", userLocation);
        },
        error => {
            console.error("Error getting location:", error);
        }
    );
}

function setupEventListeners() {
    // Mobile menu toggle (will be added later)
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // Task category selection
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectCategory(this);
        });
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

function selectCategory(button) {
    // Remove active class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-800');
    });

    // Add active class to clicked button
    button.classList.add('bg-indigo-600', 'text-white');
    button.classList.remove('bg-gray-200', 'text-gray-800');

    // Store selected category
    const category = button.dataset.category;
    console.log("Selected category:", category);
}

// Mock API functions
async function fetchNearbyTasks() {
    // In a real app, this would call your backend API
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: "Grocery Shopping",
                    description: "Need someone to pick up groceries from Whole Foods",
                    category: "shopping",
                    budget: 25,
                    distance: "0.5 miles",
                    posted: "2 hours ago"
                },
                {
                    id: 2,
                    title: "Dry Cleaning Pickup",
                    description: "Pick up dry cleaning from Main St Cleaners",
                    category: "errands",
                    budget: 15,
                    distance: "1.2 miles",
                    posted: "1 hour ago"
                }
            ]);
        }, 500);
    });
}

// Initialize map (placeholder for actual map implementation)
function initMap() {
    console.log("Map would be initialized here");
    // Actual implementation would use Google Maps or Mapbox API
}

// Form validation
function validateTaskForm(formData) {
    const errors = {};
    
    if (!formData.title || formData.title.length < 5) {
        errors.title = "Title must be at least 5 characters";
    }
    
    if (!formData.description || formData.description.length < 20) {
        errors.description = "Description must be at least 20 characters";
    }
    
    if (!formData.budget || isNaN(formData.budget) || formData.budget < 5) {
        errors.budget = "Budget must be at least $5";
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateTaskForm,
        selectCategory
    };
}