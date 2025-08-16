// Data management module
const dataModule = {
    sessionsData: [],
    isLoading: false,

    async loadGoogleSheetsData() {
        try {
            uiModule.updateConnectionStatus('loading');
            this.updateLoadingState(true);
            debugModule.updateDebugInfo('Starting Google Sheets API call...');
            
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.GOOGLE_SHEETS.SHEET_ID}/values/${CONFIG.GOOGLE_SHEETS.SHEET_NAME}?key=${CONFIG.GOOGLE_SHEETS.API_KEY}`;
            debugModule.updateDebugInfo(`API URL: ${url}`);
            
            console.log('Fetching data from Google Sheets...', url);
            
            const response = await fetch(url);
            debugModule.updateDebugInfo(`Response status: ${response.status}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                debugModule.updateDebugInfo(`Error response: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            debugModule.updateDebugInfo(`Received data with ${data.values ? data.values.length : 0} rows`);
            console.log('Raw data from Google Sheets:', data);
            
            if (data.values && data.values.length > 1) {
                // Process the data (skip header row)
                const rows = data.values.slice(1);
                this.sessionsData = rows.map((row, index) => {
                    const session = {
                        student: row[0] || '',
                        teacher: row[1] || '',
                        internalNotes1: row[2] || '',
                        internalNotes2: row[3] || '',
                        sharedNotes1: row[4] || '',
                        sharedNotes2: row[5] || '',
                        serviceName: row[6] || '',
                        status: row[7] || '',
                        fromTime: row[8] || '',
                        toTime: row[9] || '',
                        date: row[10] || '',
                        description: row[11] || '',
                        participantDescription: row[12] || '',
                        lessonFlag: row[13] || '',
                        participantIdEvent: row[14] || '',
                        participantsId: row[15] || '',
                        dateTime: row[16] || '',
                        completedAt: row[17] || '',
                        employeeId: row[18] || ''
                    };
                    
                    if (index < 3) { // Log first 3 sessions for debugging
                        debugModule.updateDebugInfo(`Session ${index + 1}: ${session.student} - ${session.teacher} - ${session.status}`);
                    }
                    
                    return session;
                });
                
                debugModule.updateDebugInfo(`Successfully loaded ${this.sessionsData.length} sessions from Google Sheets`);
                console.log(`Loaded ${this.sessionsData.length} sessions from Google Sheets`);
                uiModule.updateConnectionStatus('connected');
                uiModule.updateStats();
                uiModule.setupDashboard();
            } else {
                throw new Error('No data found in the sheet or empty response');
            }
            
        } catch (error) {
            debugModule.updateDebugInfo(`Error loading Google Sheets: ${error.message}`);
            console.error('Error loading Google Sheets data:', error);
            
            // Fall back to sample data
            console.log('Using sample data as fallback');
            debugModule.updateDebugInfo('Falling back to sample data');
            this.sessionsData = SAMPLE_DATA;
            uiModule.updateConnectionStatus('error');
            uiModule.updateStats();
            uiModule.setupDashboard();
            
            // Show detailed error in debug mode
            if (debugModule.debugMode) {
                uiModule.showErrorMessage(`Google Sheets Error: ${error.message}. Using sample data. Check debug panel for details.`);
            } else {
                uiModule.showErrorMessage('Connected to sample data. Press Cmd+Shift+D (Mac) or Ctrl+Shift+D (PC) for debug info.');
            }
            
        } finally {
            this.updateLoadingState(false);
        }
    },

    updateLoadingState(loading) {
        this.isLoading = loading;
        const container = document.getElementById('sessionsContainer');
        
        if (loading) {
            container.innerHTML = `
                <div class="no-sessions">
                    <h3>🔄 Loading your data...</h3>
                    <p>Connecting to Google Sheets</p>
                </div>
            `;
        }
    },

    getFilteredSessions(studentName = null, teacherFilter = '', statusFilter = '', serviceFilter = '') {
        let filtered = [...this.sessionsData];
        
        if (studentName) {
            filtered = filtered.filter(s => s.student === studentName);
        }
        
        if (teacherFilter) {
            filtered = filtered.filter(s => s.teacher === teacherFilter);
        }
        
        if (statusFilter) {
            filtered = filtered.filter(s => s.status === statusFilter);
        }
        
        if (serviceFilter) {
            filtered = filtered.filter(s => s.serviceName === serviceFilter);
        }
        
        return filtered;
    },

    getUniqueStudents() {
        return [...new Set(this.sessionsData.map(s => s.student).filter(s => s))];
    },

    getUniqueTeachers() {
        return [...new Set(this.sessionsData.map(s => s.teacher).filter(t => t))];
    },

    getStats() {
        const totalSessions = this.sessionsData.length;
        const attendedSessions = this.sessionsData.filter(s => s.status === 'Attended').length;
        const uniqueStudents = this.getUniqueStudents().length;
        const uniqueTeachers = this.getUniqueTeachers().length;

        return {
            totalSessions,
            attendedSessions,
            uniqueStudents,
            uniqueTeachers
        };
    }
};