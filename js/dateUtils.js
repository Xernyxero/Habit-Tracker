export function getDaysDiff(startDateStr, endDateStr) {
    const d1 = new Date(startDateStr); d1.setHours(0,0,0,0);
    const d2 = new Date(endDateStr); d2.setHours(0,0,0,0);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}