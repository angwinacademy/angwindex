// Debug functionality module
const debugModule = {
    debugMode: false,

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        document.getElementById('debugInfo').style.display = this.debugMode ? 'block' : 'none';
        const toggleBtn = document.getElementById('debugToggle');
        toggleBtn.textContent = this.debugMode ? '🐛 Hide Debug' : '🐛 Debug';
        this.updateDebugInfo('Debug mode: ' + (this.debugMode ? 'ON' : 'OFF'));
        
        if (this.debugMode) {
            // Show current status when debug is enabled
            this.updateDebugInfo(`Current data source: ${dataModule.sessionsData === SAMPLE_DATA ? 'Sample Data' : 'Google Sheets'}`);
            this.updateDebugInfo(`Total sessions loaded: ${dataModule.sessionsData.length}`);
        }
    },

    updateDebugInfo(message) {
        if (this.debugMode) {
            const debugDiv = document.getElementById('debugInfo');
            const timestamp = new Date().toLocaleTimeString();
            debugDiv.innerHTML += `<br>[${timestamp}] ${message}`;
            debugDiv.scrollTop = debugDiv.scrollHeight;
        }
    },

    setupDebugListeners() {
        // Debug mode toggle (press Ctrl+Shift+D on Windows/Linux or Cmd+Shift+D on Mac)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                this.toggleDebugMode();
            }
        });

        // Make toggleDebugMode available globally for the HTML onclick
        window.toggleDebugMode = this.toggleDebugMode.bind(this);
    }
};