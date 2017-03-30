app.config(['$routeProvider', '$controllerProvider',
    '$compileProvider', '$filterProvider', '$provide', '$httpProvider',


    function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {

        /*
         * Se registran las referencias  a los componentes en el
         * atributo 'register' del módulo. Es utilizado para
         * implementar el lazy load de los módulos.
         */
        app.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };


        $provide.factory('Auth', function() {
            return window.authFactory;
        });

        $routeProvider.when('/', {
            templateUrl: 'partials/home-partial.html',
            controller: 'HomeController',
            titulo: 'Tanque Digi'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login-tmpl.html',
            controller: 'LoginController'
        });

        $routeProvider.otherwise({
            redirectTo: '/404'
        });

        $routeProvider.when('/clientes', {
            templateUrl: 'partials/clientes/clientes-partial.html',
            controller: 'ClientesController',
            titulo: 'Clientes'

        });

        $routeProvider.when('/clientes/agregar', {
            templateUrl: 'partials/clientes/crear-clientes-partial.html',
            controller: 'CrearClientesController',
            titulo: 'Agregar'

        });

        $routeProvider.when('/clientes/modificar', {
            templateUrl: 'partials/clientes/modificar-clientes-partial.html',
            controller: 'ModificarClientesController',
            titulo: 'Modificar'

        });

        $httpProvider.responseInterceptors.push(function($q) {
            return function(promise) {
                return promise.then(function(response) {
                    return response;
                }, function(response) {
                    MasterUtils.redirectError(response.status);
                    response = MasterUtils.processResponse(response);
                    return $q.reject(response);
                });
            };
        });

        /*$httpProvider.interceptors.push(function($q, Auth) {
            return {
                request: function(config) {
                    var deferred = $q.defer();
                    if (Auth.authz.token) {
                        Auth.authz.updateToken(5).success(function() {
                            config.headers = config.headers || {};
                            config.headers.Authorization = 'Bearer ' + Auth.authz.token;
                            config.headers.usuario = Auth.authz.idTokenParsed.preferred_username;
                            deferred.resolve(config);
                        }).error(function() {
                            deferred.reject('Failed to refresh token');
                        });
                    }
                    return deferred.promise;
                }
            };
        });*/

    }
]);
app.value("tempStorage", {}).service("Navigator", function($location, tempStorage) {
    return {
        /**
         * @param   url
         * @param   args Parametros
         * @return
         */
        goTo: function(url, args) {
            tempStorage.args = args;
            $location.path(url);
        }
    };
});
app.run(['$rootScope', '$location', 'tempStorage',
    function($rootScope, $location, tempStorage) {
        /**
         * Utilizado para paso de parametro entre controller
         */
        $rootScope.$on('$routeChangeSuccess', function(evt, current, prev) {
            current.locals.$args = tempStorage.args;
            tempStorage.args = null;
        });

        $rootScope.$on("$routeChangeStart", function(event, next, current) {
            if (!sessionStorage.getItem('userToken')) {
                $location.path("/login");
            }
        });

        $rootScope.logout = function() {
            sessionStorage.clear();
            var redirect = auth.logoutUrl;
            window.location = redirect;
        };


        $rootScope.esLogin = function() {
            if ($location.path() == "/login") {
                return true;
            } else {
                return false;
            }

        };
        $rootScope.habilitarMenu = function(aplicacion, rolPorDefecto) {
            return true;
        };
        $rootScope.habilitarSubMenu = function(rol) {
            return Auth.authz.hasResourceRole(rol, 'postventa');
            //return true;
        };

    }
]);