/**
 * Clase controlador encargada del manejo de peticiones del recurso areas retencion
 * @table   fact_areas_retencion
 * @name    areas-retencion
 * @class   
 * @name    kml3-frontend.module.facturacion.js.services.areas-retencion-services.js
 * @mail    <a href= mailto:ivan.gomez@konecta.com.py>
 * @author  <a> iván gomez </a>
 */
app.factory('BaseServices', ['$http', 'SynchronousRequest',
    function($http, synchronousRequestServices) {
        return {

            getURI: function(uri) {
                return $http.get(uri);
            },

            /**
             * Esta función obtiene un Recurso del Backend
             * @params codigo código del Recurso
             * @return {Object} wrapper request response del Backend
             */
            get: function(path) {

                var urlServicioRest = MasterUrl.serviceRest + path;
                return $http.get(urlServicioRest, {}).then(
                    function(succesResults) {
                        customResult = {
                            status: succesResults.status,
                            data: succesResults.data
                        };
                        return customResult;
                    },
                    function(failResults) {
                        customResult = {
                            status: failResults.status,
                            data: failResults.data
                        };
                        return customResult;
                    }
                );
            },

            /**
             * Esta función obtiene un Recurso del Backend de forma sincrona
             * @param codigo
             * @returns {objeto a JSON para que sea utlizable}
             */
            getSync: function(datos, path) {

                var urlServicioRest = MasterUrl.serviceRest + path +
                    '?keyParam= ' + encodeURIComponent(JSON.stringify(datos));
                try {

                    var response = synchronousRequestServices.synchronousRequest("GET", urlServicioRest, "Content-Type");

                    return response;
                } catch (err) {
                    console.log(err);
                    throw new Error(err);
                }
            },

            /**
             * Esta función obtiene un Recurso del Backend, lista de fact_areas_retencion
             * @param filtro
             * @param inicio
             * @param cantidad
             * @param orderBy
             * @param orderDir
             * @returns {lista}
             */
            listar: function(filtro, inicio, cantidad, orderBy, orderDir, path) {
                
                var filtrosJson = angular.toJson(filtro);

                if ((filtrosJson.length > 2) && (filtro != null)) {
                    if (cantidad == -1) {
                        cantidad = null;
                    }
                } else {
                    filtrosJson = null;
                }
                var queryParams = {};
                queryParams['filtros'] = filtrosJson;
                if (inicio != null) {
                    queryParams['inicio'] = inicio;
                };
                if (cantidad != null) {
                    queryParams['cantidad'] = cantidad;
                };

                if (orderBy != null) {
                    queryParams['orderBy'] = orderBy;
                };

                if (orderDir != null) {
                    queryParams['orderDir'] = orderDir;
                };

                var urlServicioRest = MasterUrl.serviceRest + path;

                return $http.get(urlServicioRest, {
                    filtros: JSON.stringify(queryParams)
                }).then(
                    function(succesResults) {
                        customResult = {
                            status: succesResults.status,
                            data: succesResults.data.lista

                        };
                        return customResult;
                    },

                    function(failResults) {
                        customResult = {
                            status: failResults.status,

                            data: failResults.data
                        };
                        return customResult;

                    }
                )
            },
            /**
             * Esta función se encarga de invocar al servicio RESTful para la creación de
             * un Recurso
             * @params todos los necesarios para la creación de un recurso
             * @return {Object} request response del Backend
             */

            insertar: function(datos, path) {

                var urlServicioRest = MasterUrl.serviceRest + path;

                $http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

                return $http.post(urlServicioRest, datos, {}).then(
                    function(succesResults) {
                        var customResult = {
                            status: succesResults.status,
                            data: succesResults.data,
                            headers: succesResults.headers
                        };
                        return customResult;
                    },
                    function(failResults) {
                        var customResult = {
                            status: failResults.status,
                            data: failResults.data
                        };
                        return customResult;
                    }
                )
            },
            /**
             * Esta función se encarga de invocar al servicio RESTful de modificación
             * de un recurso
             * @params todos los necesarios para la modificación de un recurso
             * @return {Object} wrapper request response del Backend
             */
            modificar: function(datos, path) {

                var urlServicioRest = MasterUrl.serviceRest + path;

                $http.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';

                return $http.put(
                    urlServicioRest, datos, {}).then(
                    function(succesResults) {
                        var customResult = {
                            status: succesResults.status,
                            data: succesResults.data
                        };
                        return customResult;
                    },
                    function(failResults) {
                        var customResult = {
                            status: failResults.status,
                            data: failResults.data
                        };
                        return customResult;
                    }
                )
            },

            /**
             * Esta función se encarga de eliminar un recurso URI
             * @params {string} la URI
             * @return {Object} request response del Backend
             */
            eliminar: function(datos, path) {

                var urlServicioRest = MasterUrl.serviceRest + path + datos;
                return $http.delete(urlServicioRest, {}).then(
                    function(succesResults) {
                        var customResult = {
                            status: succesResults.status,
                            data: succesResults.data
                        };
                        return customResult;
                    },
                    function(failResults) {
                        var customResult = {
                            status: failResults.status,
                            data: failResults.data
                        };
                        return customResult;
                    }
                )
            },

            /**
             * Esta función obtiene un Recurso del Backend, lista de todos los valores de una url
             * @param path
             * @param datos
             * @param cantidad
             * @returns {lista}
             */

            getAll: function(path, datos, cantidad) {
                var url = MasterUrl.serviceRest + path;
                console.log(url);
                return $http.get(url, {
                    params: {
                        filtros: datos,
                        cantidad: cantidad
                    }
                }).then(
                    function(succesResult) {
                        customResult = {
                            status: succesResult.status,
                            data: succesResult.data.lista
                        };
                        return customResult;
                    },
                    function(failResults) {
                        customResult = {
                            status: failResults.status,
                            data: failResults.data.lista
                        };
                        return customResult;
                    }
                );
            }
        }
    }
]);