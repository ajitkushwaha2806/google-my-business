export const formatDate = (dateString) => {
    if (!dateString) return { date: "Unknown", time: "" };
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
};
