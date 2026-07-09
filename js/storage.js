export function loadState() {
    return {
        globalTrackerStart: localStorage.getItem('globalTrackerStart_v5') || null,
        habits: JSON.parse(localStorage.getItem('habits_v5')) || []
    };
}

export function saveState(habits, globalTrackerStart) {
    localStorage.setItem('habits_v5', JSON.stringify(habits));
    if (globalTrackerStart) {
        localStorage.setItem('globalTrackerStart_v5', globalTrackerStart);
    } else {
        localStorage.removeItem('globalTrackerStart_v5');
    }
}