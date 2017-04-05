var auth = {};
var puerto = '';
if (window.location.port != '') {
    puerto += ':' + window.location.port;
}
var urlRedirect = window.location.protocol + '//' + window.location.hostname + puerto + BaseUrl.baseBaseUrl;
auth.logoutUrl = urlRedirect;
if (angular) {
    angular.bootstrap(document, ['tanque']);
} else {
    console.log('angular is undefined');
}