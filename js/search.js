// Search functionality module
const searchModule = {
    setupSearchListeners() {
        const studentInput = document.getElementById('studentSearchInput');
        if (studentInput) {
            studentInput.removeEventListener('input', this.handleStudentSearch.bind(this)); // Remove existing listener
            studentInput.addEventListener('input', this.handleStudentSearch.bind(this));
        }
    },

    handleStudentSearch() {
        const searchTerm = document.getElementById('studentSearchInput').value.toLowerCase();
        const dropdown = document.getElementById('autocompleteDropdown');
        
        debugModule.updateDebugInfo(`Search term: "${searchTerm}"`);
        
        if (searchTerm.length < 1) {
            dropdown.style.display = 'none';
            // Reset to default state
            uiModule.displayDefaultMessage();
            return;
        }

        const students = dataModule.getUniqueStudents();
        const matchingStudents = students.filter(student => 
            student.toLowerCase().includes(searchTerm)
        );

        debugModule.updateDebugInfo(`Found ${matchingStudents.length} matching students`);

        if (matchingStudents.length > 0) {
            dropdown.innerHTML = matchingStudents.slice(0, 10).map(student => 
                `<div class="autocomplete-item" onclick="searchModule.selectStudent('${student.replace(/'/g, "\\\'")}')">${student}</div>`
            ).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    },

    selectStudent(studentName) {
        debugModule.updateDebugInfo(`Student selected: ${studentName}`);
        document.getElementById('studentSearchInput').value = studentName;
        document.getElementById('autocompleteDropdown').style.display = 'none';
        
        // Show student sessions
        const studentSessions = dataModule.getFilteredSessions(studentName);
        debugModule.updateDebugInfo(`Found ${studentSessions.length} sessions for ${studentName}`);
        uiModule.displayStudentSessions(studentName, studentSessions);
    },

    // Advanced search functionality - to be implemented
    performAdvancedSearch() {
        const teacherFilter = document.getElementById('teacherFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const serviceFilter = document.getElementById('serviceFilter').value;
        const studentName = document.getElementById('studentSearchInput').value;
        
        // Get filtered sessions
        const filteredSessions = dataModule.getFilteredSessions(
            studentName || null, 
            teacherFilter, 
            statusFilter, 
            serviceFilter
        );
        
        if (studentName) {
            uiModule.displayStudentSessions(studentName, filteredSessions);
        } else {
            // Display all filtered sessions (future enhancement)
            debugModule.updateDebugInfo(`Advanced search found ${filteredSessions.length} sessions`);
        }
    }
};