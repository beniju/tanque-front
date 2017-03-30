var auth = {};
var puerto = '';
if (window.location.port != '') {
    puerto += ':' + window.location.port;
}
var urlRedirect = window.location.protocol + '//' + window.location.hostname + puerto + MasterUrl.baseMasterUrl;
auth.logoutUrl = urlRedirect;
if (angular) {
    angular.bootstrap(document, ['electroaqui']);
} else {
    console.log('angular is undefined');
}