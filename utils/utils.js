function formatDate(UTCstring) {
    return UTCstring.toISOString().substring(0, 10)
};

module.exports = { 
    formatDate:formatDate 
} 