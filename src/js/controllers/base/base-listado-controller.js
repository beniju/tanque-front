/**
 * Controlador Base para un buscador standard
 * 
 * @mail     <a href="mailto:juan.benitez@konecta.com.py"/>
 * @author   <a juan benitez</>
 */
app.controller('BaseListadoController', ['$scope','AlertServices','Navigator','$location','$filter','$dialogs','serviciosjqgrid',
    function ($scope,alertServices,Navigator,$location,$filter,$dialogs, serviciosjqgrid) {

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

        /**
         * variable que controla el objeto principal de la pagina
         * @type {{}}
         */
        $scope.datos = {};

        /**
         *
         * @type {{bloquear: boolean}}
         */
        $scope.uiBlockuiConfig = {'bloquear': false};

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
            //variable que controla la clase del panel de filtrado
            clasePanel : "col-lg-8 col-lg-offset-2",
            //variable que controla la clase de la grilla
            claseGrilla : "col-lg-8 col-lg-offset-2",
            //variable que controla la clase del contrnedor de los inputs
            claseTransclude : "col-lg-8",
            //variable que controla la clase de los botones de busqueda y limpiado
            claseBusqueda : "col-lg-4",
            //variable que controla la url del metodo delete
            servicePathDelete : ""
        };

        /**
         * funcion que limpia los datos de la pantalla
         */
        $scope.limpiar = function () {
            Kml3Utils.deleteValues($scope.datos);
            $scope.tableParams.setGridParam({
                datatype: "local"
            });
            $scope.tableParams.reloadGrid();
            $scope.disabled = true;
        };

        /**
         * funcion de busqueda de regstros
         */
        $scope.buscar = function () {
            $scope.disabled = true;
            Kml3Utils.deleteUndefinedValues($scope.datos);
            
            var post = $scope.tableParams.getGridParam("postData");
            if(angular.toJson(post.filtros) != angular.toJson(JSON.stringify($scope.datos))){
                $scope.totalGrilla = 0;
            }

            $scope.tableParams.setGridParam({
                postData: {
                    filtros: angular.toJson($scope.datos),
                    total: $scope.totalGrilla
                }
            });
            $scope.tableParams.setGridParam({
                datatype: "json",
                page: "1"
            });
            $scope.tableParams.reloadGrid();
        };

        /**
         * funcion que lleva al formulario de carga del registro
         */
        $scope.agregar = function () {
            Navigator.goTo($location.path() + "/agregar");
        };

        /**
         * funcion que lleva al formulario de edicion del registro
         */
        $scope.modificar = function () {
            if ($scope.rowSeleccionado) {
                $scope.selectedRow = $scope.tableParams.getRowData($scope.rowSeleccionado);
                Navigator.goTo($location.path() + '/modificar',
                    $scope.generateData()
                );
            }
        };

        $scope.generateData = function () {
            return {
                modificarAbm:true,
                data: $scope.tableParams.getGridParam("userData")[$scope.rowSeleccionado - 1]
            }
        };

        /**
         * funcion que elimina el registro seleccionado en la grilla
         */
        $scope.eliminar = function () {
            var dlg = $dialogs.warningConfirm("Por Favor Confirmar", "Esta Seguro que desea eliminar el registro?");
            dlg.result.then(function () {
                $scope.uiBlockuiConfig.bloquear = true;
                if ($scope.rowSeleccionado) {
                    $scope.selectedRow = $scope.tableParams.getRowData($scope.rowSeleccionado);
                    if($scope.services){
                        $scope.services.eliminar($scope.generatePk($scope.selectedRow), $scope.baseConfiguration.servicePath + $scope.baseConfiguration.servicePathDelete).then(
                            function (response) {
                                if (response.status === 200) {
                                    Kml3Utils.deleteUndefinedValues($scope.datos);
                                    $scope.tableParams.clearGridData();
                                    $scope.tableParams.reloadGrid();
                                    $scope.disabled = true;
                                } else {
                                    $scope.alertErrorServices.addSimpleAlert("operationFailure", null, response.data.messages);
                                }
                            }
                        );
                    }else{
                        $scope.alertErrorServices.addSimpleAlert("operationFailure", null, "No se declaro el service el service");
                    }
                    $scope.uiBlockuiConfig.bloquear = false;
                }
            }, function (btn) {

            });
        };

        /**
         *
         * @type {null}
         */
        $scope.rowSeleccionado = null;

        /**
         *
         * @type {{}}
         */
        $scope.selectedRow = {};

        /**
         * Variable que administra el total de registros de las consultas
         * @type {number}
         */
        $scope.totalGrilla = 0;

        /**
         * Configuracion estandar del jqgrid
         * @type {{url: *, datatype: string, height: string, shrinkToFit: boolean, autowidth: boolean, rowNum: number, rowList: Array, postData: {cantidad: $scope.jqgridConfig.postData.cantidad, inicio: $scope.jqgridConfig.postData.inicio, orderByAttrList: string}, colModel: (string|Array|*), jsonReader: {repeatitems: boolean, root: string, total: $scope.jqgridConfig.jsonReader.total, records: string, id: string, userdata: string}, emptyrecords: string, pager: string, viewrecords: boolean, gridview: boolean, hidegrid: boolean, altRows: boolean, loadError: $scope.jqgridConfig.loadError, onSortCol: $scope.jqgridConfig.onSortCol, onSelectRow: $scope.jqgridConfig.onSelectRow, loadComplete: $scope.jqgridConfig.loadComplete, onPaging: $scope.jqgridConfig.onPaging}}
         */
        $scope.jqgridConfig = {
            //ariable que controla la url del servicio de busqueda del jqgrid
            //debe ser declarado en el controlador de cada parametrico antes de la herencia
            url: $scope.urlAccess,
            datatype: "local",
            height: "auto",
            shrinkToFit: true,
            autowidth: true,
            //variable que indica cuantos registros deben mostrarse en el jqgrid
            //debe ser declarado en el controlador de cada parametrico antes de la herencia
            rowNum: $scope.rowNum,
            rowList: [],
            postData: {
                cantidad: function () {
                    return $scope.tableParams.getGridParam("rowNum");
                },
                inicio: function () {
                    return $scope.tableParams.getRowsStart();
                }
            },
            //variable de configuracion de las columnas del jqgrid
            //debe ser declarado en el controlador de cada parametrico antes de la herencia
            colModel: $scope.colModel,
            jsonReader: {
                repeatitems: false,
                root: "lista",
                total: function (data) {
                    return  Math.ceil($scope.totalGrilla /
                        $scope.tableParams.getGridParam("rowNum"));
                },
                records: "totalDatos",
                id: "Id",
                userdata: "lista"
            },
            emptyrecords: "Sin Datos",
            pager: "#pager",
            viewrecords: true,
            gridview: false,
            hidegrid: false,
            altRows: true,
            loadError: function (xhr) {
                var response = Kml3JqgridUtils.processResponseJqgrid(xhr, $scope.tableParams);
                if (xhr.status !== 404) {
                    $scope.alertErrorServices.addSimpleAlert("operationError", null, response.data.messages);
                    $scope.$apply();
                }
            },
            onSortCol: function (index, iCol, sortorder) {
                $scope.tableParams.setGridParam({
                    postData: {
                        orderBy: index,
                        orderDir: sortorder
                    }
                });
                $scope.disabled = true;
                $scope.$apply();
            },
            onSelectRow: function (id) {
                $scope.onSelectRow(id);
                $scope.$apply();
            },
            loadComplete: function (cellvalue) {
                $scope.totalGrilla = cellvalue.totalDatos;
                $scope.disabled = true;
                $scope.$apply();
            },
            onPaging: function () {
                $scope.tableParams.setGridParam({
                    postData: {
                        total: $scope.totalGrilla
                    }
                });
                $scope.disabled = true;
                $scope.$apply();
            }
        };

        /**
         * Se inicializa el jqgrid
         * @type {serviciosjqgrid|*}
         */
        $scope.tableParams = new serviciosjqgrid($scope.jqgridConfig);

        /**
         * funcion que controla el evento del onSelectRow
         * puede ser sobre escrito en el controlador de cada parametrico
         * @param id
         */
        $scope.onSelectRow = function (id) {
            $scope.rowSeleccionado = id;
            $scope.disabled = false;
        };

        /**
         * funcion que genera el pk para eliminar el registro
         * debe ser sobre escrito en el controlador de cada parametrico
         * @param datos
         * @returns {null}
         */
        $scope.generatePk = function (datos) {
            return null;
        };

    }
]);