// UI management module
const uiModule = {
    updateConnectionStatus(status, message) {
        const statusDiv = document.getElementById('connectionStatus');
        statusDiv.className = `connection-status ${status}`;
        
        switch(status) {
            case 'connected':
                statusDiv.innerHTML = '✅ Connected to Google Sheets';
                break;
            case 'error':
                statusDiv.innerHTML = '⚠️ Using Sample Data';
                break;
            case 'loading':
                statusDiv.innerHTML = '🔄 Connecting...';
                break;
        }

        // Hide status after 3 seconds if connected
        if (status === 'connected') {
            setTimeout(() => {
                statusDiv.style.opacity = '0.3';
            }, 3000);
        }
    },

    updateStats() {
        const stats = dataModule.getStats();
        
        document.getElementById('totalSessions').textContent = stats.totalSessions;
        document.getElementById('attendedSessions').textContent = stats.attendedSessions;
        document.getElementById('uniqueStudents').textContent = stats.uniqueStudents;
        document.getElementById('uniqueTeachers').textContent = stats.uniqueTeachers;

        debugModule.updateDebugInfo(`Stats updated: ${stats.totalSessions} sessions, ${stats.uniqueStudents} students, ${stats.uniqueTeachers} teachers`);
        
        // Populate teacher filter
        this.populateTeacherFilter();
    },

    populateTeacherFilter() {
        const teacherSelect = document.getElementById('teacherFilter');
        teacherSelect.innerHTML = '<option value="">All Teachers</option>';
        const teachers = dataModule.getUniqueTeachers().sort();
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher;
            option.textContent = teacher;
            teacherSelect.appendChild(option);
        });
    },

    setupDashboard() {
        debugModule.updateDebugInfo('Setting up dashboard event listeners');
        
        // Set up logout button
        document.getElementById('logoutBtn').addEventListener('click', logout);
        
        // Set up search functionality  
        searchModule.setupSearchListeners();
        
        // Set up advanced toggle
        const advancedToggle = document.getElementById('advancedToggle');
        if (advancedToggle) {
            advancedToggle.removeEventListener('click', this.toggleAdvancedFilters);
            advancedToggle.addEventListener('click', this.toggleAdvancedFilters);
        }

        // Close autocomplete when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.student-search-container')) {
                document.getElementById('autocompleteDropdown').style.display = 'none';
            }
        });
    },

    toggleAdvancedFilters() {
        const filters = document.getElementById('advancedFilters');
        filters.classList.toggle('show');
        debugModule.updateDebugInfo(`Advanced filters toggled: ${filters.classList.contains('show') ? 'shown' : 'hidden'}`);
    },

    displayDefaultMessage() {
        const container = document.getElementById('sessionsContainer');
        container.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #4a5568;">📋 Sessions</h2>
            <div class="no-sessions">
                <h3>Search for a student</h3>
                <p>Type in a student's name above to view their session history</p>
            </div>
        `;
    },

    displayStudentSessions(studentName, sessions) {
        const container = document.getElementById('sessionsContainer');
        
        if (sessions.length === 0) {
            container.innerHTML = `
                <h2 style="margin-bottom: 20px; color: #4a5568;">📋 Sessions</h2>
                <div class="no-sessions">
                    <h3>No sessions found for ${studentName}</h3>
                    <p>This student doesn't have any recorded sessions yet.</p>
                </div>
            `;
            return;
        }

        // Sort sessions by date (most recent first)
        const sortedSessions = sessions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        container.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #4a5568;">📋 Sessions for ${studentName}</h2>
            <div style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px;">
                <strong>Total Sessions:</strong> ${sessions.length} | 
                <strong>Attended:</strong> ${sessions.filter(s => s.status === 'Attended').length} | 
                <strong>Cancelled:</strong> ${sessions.filter(s => s.status === 'Cancelled').length}
            </div>
            ${sortedSessions.map((session, index) => `
                <div class="session-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <strong style="font-size: 1.1rem;">${session.teacher}</strong>
                        <span style="padding: 4px 12px; border-radius: 20px; font-size: 0.875rem; font-weight: 500; background: ${this.getStatusColor(session.status)};">
                            ${session.status}
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 15px;">
                        <div>
                            <div style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 600;">Date</div>
                            <div style="color: #2d3748; font-weight: 500;">${session.date}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 600;">Time</div>
                            <div style="color: #2d3748; font-weight: 500;">${session.fromTime} - ${session.toTime}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 600;">Service</div>
                            <div style="color: #2d3748; font-weight: 500;">${session.serviceName || 'Tutoring'}</div>
                        </div>
                    </div>
                    ${(session.sharedNotes1 || session.sharedNotes2) ? `
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                            <div style="font-weight: 600; margin-bottom: 8px; color: #4a5568;">📝 Shared Notes</div>
                            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                ${session.sharedNotes1 ? `<p style="margin-bottom: ${session.sharedNotes2 ? '10px' : '0'};">${session.sharedNotes1}</p>` : ''}
                                ${session.sharedNotes2 ? `<p style="margin: 0;">${session.sharedNotes2}</p>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    ${(session.internalNotes1 || session.internalNotes2) ? `
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                            <div style="font-weight: 600; margin-bottom: 8px; color: #4a5568;">🔒 Internal Notes</div>
                            <div style="background: #fefefe; padding: 12px; border-radius: 8px; border: 1px solid #f1f5f9; color: #4a5568;">
                                ${session.internalNotes1 ? `<p style="margin-bottom: ${session.internalNotes2 ? '10px' : '0'};">${session.internalNotes1}</p>` : ''}
                                ${session.internalNotes2 ? `<p style="margin: 0;">${session.internalNotes2}</p>` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        `;
    },

    getStatusColor(status) {
        switch(status) {
            case 'Attended':
                return '#c6f6d5; color: #22543d';
            case 'Cancelled':
                return '#fed7d7; color: #742a2a';
            case 'Pending':
                return '#feebc8; color: #7c2d12';
            default:
                return '#f1f5f9; color: #4a5568';
        }
    },

    showErrorMessage(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #fed7d7;
            color: #742a2a;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #feb2b2;
            max-width: 350px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
        `;
        notification.innerHTML = `
            <strong>⚠️ Connection Notice</strong><br>
            ${message}<br>
            <small style="opacity: 0.8;">Click to dismiss</small>
        `;
        
        notification.onclick = () => document.body.removeChild(notification);
        document.body.appendChild(notification);
        
        // Remove after 8 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 8000);
    }
};