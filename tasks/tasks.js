// Task management functionality for TaskEase
document.addEventListener('DOMContentLoaded', function() {
    // Initialize task forms if they exist on the page
    if (document.getElementById('taskForm')) {
        initTaskForm();
    }
    
    // Load tasks for browse page
    if (document.getElementById('taskList')) {
        loadTasks();
    }
});

function initTaskForm() {
    const taskForm = document.getElementById('taskForm');
    
    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const taskData = {
            title: taskForm.title.value,
            description: taskForm.description.value,
            budget: parseFloat(taskForm.budget.value),
            location: taskForm.location.value,
            category: 'general', // Would be selected from a dropdown in a real app
            postedBy: localStorage.getItem('userEmail'),
            postedAt: new Date().toISOString()
        };
        
        // Show loading state
        const submitButton = taskForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Posting Task...';
        
        try {
            // Mock task creation - in a real app this would call your backend
            await createTask(taskData);
            
            // Show success message
            showTaskMessage('Task posted successfully!', 'success');
            
            // Reset form
            taskForm.reset();
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } catch (error) {
            showTaskMessage(error.message, 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

async function loadTasks() {
    try {
        // Show loading state
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '<div class="col-span-3 text-center py-8"><i class="fas fa-spinner fa-spin text-indigo-600 text-2xl"></i><p class="mt-2 text-gray-600">Loading tasks...</p></div>';
        
        // Fetch tasks - in a real app this would call your backend
        const tasks = await fetchNearbyTasks();
        
        // Render tasks
        renderTasks(tasks);
    } catch (error) {
        showTaskMessage('Failed to load tasks. Please try again.', 'error');
        console.error(error);
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="col-span-3 text-center py-8"><i class="fas fa-tasks text-gray-400 text-2xl"></i><p class="mt-2 text-gray-600">No tasks available in your area.</p></div>';
        return;
    }
    
    taskList.innerHTML = tasks.map(task => `
        <div class="bg-white rounded-lg shadow-md p-6 task-card">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <span class="inline-block px-2 py-1 text-xs font-semibold ${getCategoryClass(task.category)} rounded-full">
                        ${formatCategory(task.category)}
                    </span>
                </div>
                <span class="text-sm text-gray-500">${task.distance} away</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">${task.title}</h3>
            <p class="text-gray-600 mb-4">${task.description}</p>
            <div class="flex justify-between items-center">
                <span class="font-bold text-indigo-600">$${task.budget}</span>
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 view-task-btn" data-task-id="${task.id}">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-task-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');
            viewTaskDetails(taskId);
        });
    });
}

function viewTaskDetails(taskId) {
    // In a real app, this would show a modal or redirect to a task details page
    console.log(`Viewing details for task ${taskId}`);
    alert(`Task details would be shown here for task ${taskId}`);
}

// Mock task creation
async function createTask(taskData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simple validation for demo purposes
            if (taskData.title && taskData.description && taskData.budget >= 5) {
                resolve({ success: true });
            } else {
                reject(new Error('Please fill all fields correctly. Minimum budget is $5.'));
            }
        }, 1000);
    });
}

// Helper functions
function getCategoryClass(category) {
    const classes = {
        'shopping': 'bg-indigo-100 text-indigo-800',
        'errands': 'bg-green-100 text-green-800',
        'cleaning': 'bg-yellow-100 text-yellow-800',
        'moving': 'bg-red-100 text-red-800'
    };
    return classes[category] || 'bg-gray-100 text-gray-800';
}

function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function showTaskMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.task-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and display new message
    const messageElement = document.createElement('div');
    messageElement.className = `task-message ${type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' : 'bg-green-50 border-l-4 border-green-500 text-green-700'} p-4 mb-4`;
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
    
    // Insert message at the top of the form or page
    const form = document.querySelector('form') || document.querySelector('main');
    form.insertBefore(messageElement, form.firstChild);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createTask,
        renderTasks,
        getCategoryClass,
        formatCategory
    };
}