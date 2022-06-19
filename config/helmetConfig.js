const helmet = require("helmet");

function configureHelmetCPS() {
    return helmet.contentSecurityPolicy({
        directives: {
          "script-src": ["'self'", "cdn.jsdelivr.net"],
          "style-src": ["'self'", "cdn.jsdelivr.net",],
        },
    });
};

module.exports = {
    configureHelmetCPS: configureHelmetCPS
}