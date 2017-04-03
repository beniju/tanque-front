/**
 * Controlador Base para los forminarios de Carga y Edición Standard
 *
 * @mail     <a href="mailto:juan.benitez@konecta.com.py"/>
 * @author   <a juan benitez</>
 */
app.controller('BaseAbmController', ['$scope','AlertServices','$route','$args','Navigator','$location','$filter','$dialogs',
    function ($scope,alertServices,$route,$args,Navigator,$location,$filter,$dialogs) {

        /**
         *
         * @type {{type: string, scroll: boolean, closeable: boolean, timeout: number}}
         */
        $scope.alertSuccessConfig = {
            type: 'success',
            scroll: true,
            closeable: true,
            timeout: 10000
        };
        $scope.alertSuccesServices = alertServices.getInstance();

        /**
         *
         * @type {{type: string, scroll: boolean, closeable: boolean, timeout: number}}
         */
        $scope.alertWarningConfig = {
            type: 'warning',
            scroll: true,
            closeable: true,
            timeout: 10000
        };
        $scope.alertWarningServices = alertServices.getInstance();

        /**
         *
         * @type {{type: string, scroll: boolean, closeable: boolean, timeout: number}}
         */
        $scope.alertErrorConfig = {
            type: 'danger',
            scroll: true,
            closeable: true,
            timeout: 10000
        };
        $scope.alertErrorServices = alertServices.getInstance();

        $scope.uiBlockuiConfig = {'bloquear': false};

        /**
         * variable que controla el objeto principal de la pagina
         * @type {{}}
         */
        $scope.datos = {};

        /**
         * objeto de configuracion de pagina
         * debe ser sobre escrito en el controlador de cada parametrico
         * @type {{}}
         */
        $scope.baseConfiguration = {
            //variable que controla el titulo principal de la pagina
            //debe ser sobre escrito en el controlador de cada parametrico
            tituloParametrico : "Titulo Base",
            //variable que controla el path el servicio invocado en los parametricos
            //debe ser sobre escrito en el controlador de cada parametrico
            servicePath : "base-path",
            //variable que controla la url del metodo Update
            servicePathUpdate : "",
            //variable que controla la url del metodo Insert
            servicePathInsert : "",
            claseTransclude : "col-lg-9"
        };

        /**
         * variable que indica si el abm corresponde a un insert o update
         * por defecto false
         * @type {boolean}
         */
        $scope.modificarAbm= false;

        (function initialization() {
            if ($args && $args.modificarAbm) {
                $scope.modificarAbm = $args.modificarAbm;
                $scope.datos = $args.data;
            } else {
                //Variable que hace referencia al path del parametrico,
                //debe ser sobre escrito en el controlador de cada parametrico antes de la herencia
                $location.path($scope.path);
            }
        })();

        /**
         * funcion encargada de llamar a las funciones
         * insertar o modificar
         */
        $scope.confirmar = function () {
            $scope.beforeInsertOrUpdate();
            if(!$scope.modificarAbm){
                insertar();
            }else{
                modificar();
            }
        };

        /**
         * funcion que llama al servicio que inserta un registro
         */
        function insertar() {
            if($scope.services){
            $scope.uiBlockuiConfig.bloquear = true;
                $scope.services.insertar($scope.generateJson($scope.datos), $scope.baseConfiguration.servicePath + $scope.baseConfiguration.servicePathInsert).then(
                    function (response) {
                        if (response.status === 201) {
                            var dlg = $dialogs.notify("Notificación", "Sus datos se insertaron con éxito!");
                            dlg.result.then(function () {
                                $route.reload();
                            }, function (btn) {
                            });
                        } else {
                            $scope.alertErrorServices.addSimpleAlert("operationFailure", null, response.data.messages);
                        }
                        $scope.uiBlockuiConfig.bloquear = false;
                    }
                );
            }else{
                $scope.alertErrorServices.addSimpleAlert("operationFailure", null, "No se declaro el service el service");
            }
        }

        /**
         * funcion que llama al servicio que modifica un registro
         */
        function modificar() {
            if($scope.services){
                $scope.uiBlockuiConfig.bloquear = true;
                $scope.services.modificar($scope.generateJson($scope.datos), $scope.baseConfiguration.servicePath + $scope.baseConfiguration.servicePathUpdate).then(
                    function (response) {
                        if (response.status === 200) {
                            $scope.bloqueoFormulario = true;
                            var dlg = $dialogs.notify("Notificación", "Sus datos actualizaron con éxito!");
                            dlg.result.then(function () {
                                $location.path($scope.path);
                            }, function (btn) {
                            });
                        } else {
                            $scope.alertErrorServices.addSimpleAlert("operationFailure", null, response.data.messages);
                        }
                        $scope.uiBlockuiConfig.bloquear = false;
                    }
                );
            }else{
                $scope.alertWarningServices.addSimpleAlert("operationFailure", null, "Debe declarar el service");
            }

        }

        /**
         * funcion que se ejecuta ante de insertar o modificar un registro
         * puede ser sobre escrito despues de la herencia del controlador
         * base, para configurar acciones antes del llamado a las funciones
         * de insercion o modificacion
         */
        $scope.beforeInsertOrUpdate = function () {

        };

        /**
         * funcion que retorna el json que va en el metodo POST y PUT
         * @param datos
         * @returns {*}
         */
        $scope.generateJson = function (datos) {
          return datos;
        };

        /**
         * funcion que hace el retorno al bucador del parametrico
         */
        $scope.cancelar = function () {
            $location.path($scope.path);
        };

    }
]);