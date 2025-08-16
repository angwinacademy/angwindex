// Main application initialization
window.addEventListener('load', function() {
    // Initialize debug module first
    debugModule.setupDebugListeners();
    
    // Check authentication and initialize app
    checkAuthentication();
    
    // Set up authentication event listeners
    setupAuthEventListeners();
    
    // Initialize default UI state
    uiModule.displayDefaultMessage();
});