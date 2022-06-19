const helmet = require("helmet");

function configureHelmetDefault() {
    return helmet();
};

function configureHelmetCPS() {
    return helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "cdn.jsdelivr.net"],
          "style-src": ["'self'", "cdn.jsdelivr.net",],
        },
    });
};

module.exports = {
    configureHelmetDefault: configureHelmetDefault,
    configureHelmetCPS: configureHelmetCPS
}