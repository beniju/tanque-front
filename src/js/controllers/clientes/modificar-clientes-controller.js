/**
 * Modulo controlador para la crearción de recursos areas retencion
 * @table    fact_areas_retencion
 * @class
 * @name     kml3-frontend.module.facturacion.js.controllers.areas-retencion-controller.js
 *
 * @mail     <a href="mailto:ivan.gomez@konecta.com.py"/>
 * @author   <a iván gomez</>
 */
/**
 * Se define el controller y sus dependencias.
 */
app.controller('ModificarClientesController', [
    '$scope', '$route', 'serviciosjqgrid', '$location', '$dialogs', 'AlertServices', 'Navigator', '$filter', '$args', 'BaseServices',
    function($scope, $route, serviciosjqgrid, $location, $dialogs, alertServices, Navigator, $filter, $args, BaseServices) {
        $scope.titulo = 'Clientes';
        $scope.generarBodyData = function(datos) {
            var bodyData = {
                id: datos.id,
                nombre: datos.nombre,
                apellido: datos.apellido,
                documento: datos.documento,
                ruc: datos.ruc,
                telefono: datos.telefono,
                direccion: datos.direccion,
                email: datos.email
            }
            return bodyData;
        };

        $scope.generarParaJSON = function(datos) {
            var bodyData = {
                id: datos.id,
                nombre: datos.nombre,
                apellido: datos.apellido,
                documento: datos.documento,
                ruc: datos.ruc,
                telefono: datos.telefono,
                direccion: datos.direccion,
                email: datos.email
            }
            return bodyData;
        };

        /**
         *  Objeto de configuración del alert Success
         *  @type {Object}
         *  @field
         *  @name kml3-frontend.js.directives.directivas-bases.ui-alert-directives#alertSuccessConfig
         */
        $scope.alertSuccessConfig = {
            type: 'success',
            scroll: true,
            closeable: true,
            timeout: 10000
        };

        /**
         *  Objeto de configuración del alert Warning
         *  @type {Object}
         *  @field
         *  @name kml3-frontend.js.directives.directivas-bases.ui-alert-directives#alertWarningConfig
         */
        $scope.alertWarningConfig = {
            type: 'warning',
            scroll: true,
            closeable: true,
            timeout: 10000
        };

        /**
         *  Objeto de configuración del alert Error
         *  @type {Object}
         *  @field
         *  @name kml3-frontend.js.directives.directivas-bases.ui-alert-directives#alertErrorConfig
         */
        $scope.alertErrorConfig = {
            type: 'danger',
            scroll: true,
            closeable: true,
            timeout: 10000
        };

        /**
         *  Objeto que representa al servicio de administración del alert de errores y success
         *  @type {Object}
         *  @field
         *  @name kml3-frontend.js.directives.directivas-bases.ui-alert-directives#alerServices
         */
        $scope.alertErrorServices = alertServices.getInstance();
        $scope.alertWarningServices = alertServices.getInstance();
        $scope.alertSuccesServices = alertServices.getInstance();
        /**
         * Objeto de configuración de la directiva ui-blockui
         * @type {Object}
         * @name kml3-frontend.js.directives.directivas-bases.ui-blockui-directives#uiBlockuiConfig
         */
        $scope.uiBlockuiConfig = {
            'bloquear': false
        };
        /**
         * Función que es llamada desde la vista al monento de confirmar
         * @function confirmar()
         * @public
         * @name kml3-frontend.module.facturacion.js.controllers.crear-areas-retencion-controller.js#confirmar
         */
        $scope.confirmar = function() {

            $scope.uiBlockuiConfig.bloquear = true;
            BaseServices.modificar($scope.generarBodyData($scope.datos), 'clientes/')
                .then(
                    function(response) {
                        try {
                            if (response.status === 200) {

                                $scope.bloqueoFormulario = true;

                                dlg = $dialogs.notify("Notificación", "Sus datos se guardaron con éxito!");
                                dlg.result.then(function(btn) {
                                    $route.reload();
                                }, function(btn) {});

                            } else {
                                if (response.data.messages != null) {
                                    $scope.alertErrorServices.addSimpleAlert("operationFailure", null,
                                        response.data.messages);
                                } else {
                                    $scope.alertErrorServices.addSimpleAlert("operationFailure", null,
                                        "Ha ocurrido un error inesperado, por favor inténtelo más tarde");
                                }
                            }
                        } catch (err) {
                            if (response.data.messages != null) {
                                $scope.alertErrorServices.addSimpleAlert("operationFailure", null,
                                    response.data.messages);
                            } else {
                                $scope.alertErrorServices.addSimpleAlert("operationFailure", null,
                                    "Ha ocurrido un error inesperado, por favor inténtelo más tarde");
                            }
                        }
                        $scope.uiBlockuiConfig.bloquear = false;
                    }
                );
        };
        /**
         * Función que realiza la navegación al cancelar la operación
         * @function cancelar()
         * @public
         * @name kml3-frontend.module.facturacion.js.controllers.crear-areas-retencion-controller.js#cancelar
         */
        $scope.cancelar = function() {
            $location.path('/clientes')
        };

        /**
         * Funcion del controller, se encarga de gestionar los accesos a popUps y la vuelta de los
         * mismos.
         * @function launch()
         * @public
         * @param {string}which identificador del popup definido localmente entre la vista y el contralador
         */
        $scope.launch = function(which) {
            var dlg = null;
            switch (which) {

            }; // end switch
        };
        /**
         * Función encargada de inicializar la vista al momento de cargar la página
         * @function init()
         * @private
         * @name kml3-frontend.js.controllers.modificar-rubros-controller#init
         */
        $scope.init = function() {
            /**
             *  Objeto que donde se almacena los dato ingresados en los formularios
             *  @type {Object}
             *  @field
             */
            if ($args) {
                /**
                 *  Objeto  que almacena los filtros obtenidos del formulario
                 *  @public
                 *  @type {Object}
                 *  @field
                 *  @name kml3-frontend.js.controllers.modificar-rubros-controller
                 */
                $scope.datos = $args.dataM;
                console.log($scope.datos);
            } else {
                $location.path('/clientes');
            }

        };
        //se invoca a la función de inicialización
        $scope.init();
    }
]);