// Configuration constants
const CONFIG = {
    DASHBOARD_PASSWORD: "1234",
    GOOGLE_SHEETS: {
        SHEET_ID: '1SEKrq9CesJqTDmTS5KgTi6VVDuaL7109aFIm4UGFL5A',
        SHEET_NAME: 'Main',
        API_KEY: 'AIzaSyD6jMa-tKlVg62gcOzt4mj4CRUwbTXxMyo'
    }
};

// Sample data (fallback)
const SAMPLE_DATA = [
    {
        student: "Elise Wharton",
        teacher: "Brabham-Johnson, Tabatha",
        serviceName: "Tutoring",
        status: "Attended",
        fromTime: "4:00:00 PM",
        toTime: "5:00:00 PM",
        date: "8/13/2025",
        sharedNotes1: "Great progress this session!",
        sharedNotes2: "Homework: Practice problems 1-15",
        internalNotes1: "Student is improving",
        internalNotes2: "Consider advanced topics next"
    },
    {
        student: "Marcus Johnson",
        teacher: "Smith, Jennifer", 
        serviceName: "Tutoring",
        status: "Attended",
        fromTime: "3:00:00 PM",
        toTime: "4:00:00 PM",
        date: "8/14/2025",
        sharedNotes1: "Completed all assignments perfectly",
        internalNotes1: "Very dedicated student"
    },
    {
        student: "Sarah Chen",
        teacher: "Williams, Michael",
        serviceName: "Tutoring", 
        status: "Cancelled",
        fromTime: "2:00:00 PM",
        toTime: "3:00:00 PM",
        date: "8/15/2025",
        sharedNotes1: "Making steady progress",
        internalNotes1: "Family emergency, will reschedule"
    },
    {
        student: "David Rodriguez",
        teacher: "Brown, Lisa",
        serviceName: "Test Prep",
        status: "Attended", 
        fromTime: "5:00:00 PM",
        toTime: "6:00:00 PM",
        date: "8/12/2025",
        sharedNotes1: "Good session today",
        internalNotes1: "Ready for practice test"
    }
];