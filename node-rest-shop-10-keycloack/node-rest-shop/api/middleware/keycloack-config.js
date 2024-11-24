const Keycloak = require('keycloak-connect');

const keycloak = new Keycloak({
    "realm": "myrealm",
    "auth-server-url": "http://localhost:8080/auth",
    "ssl-required": "external",
    "resource": "test",
    "bearer-only": true,
    "public-client": true,
});

module.exports = keycloak;
