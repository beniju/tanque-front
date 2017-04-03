/**
 * Service Base para Controladores Bases
 *
 * @mail     <a href="mailto:juan.benitez@konecta.com.py"/>
 * @author   <a juan benitez</>
 */
app.factory('BaseServices', ['$http', 'SynchronousRequest',
    function ($http, synchronousRequestServices) {
        return {

            serviceRestUrlMap: {
                'comunes': Kml3Url.serviceRestComunes,
                'comunes/dominio-mercado': Kml3Url.serviceRestComunesMercado,
                'comunes/dominio-comun': Kml3Url.serviceRestComunesComun ,
                'comunes/dominio-clientes': Kml3Url.serviceRestComunesClientes,
                'comunes/dominio-productos': Kml3Url.serviceRestComunesProductos,
                'comunes/dominio-servicios': Kml3Url.serviceRestComunesRecursos,
                'comunes/dominio-proveedores': Kml3Url.serviceRestComunesProveedores,
                'comunes/dominio-empresarial': Kml3Url.serviceRestComunesEmpresarial,
                'auditoria': Kml3Url.serviceRestAuditoria,
                'autorizaciones': Kml3Url.serviceRestAutorizaciones,
                'balance': Kml3Url.serviceRestBalance,
                'buscadores': Kml3Url.serviceRestBuscadores,
                'catalogo': Kml3Url.serviceRestCatalogo,
                'clubpersonal': Kml3Url.serviceRestClubPersonal,
                'cobranzas': Kml3Url.serviceRestCobranzas,
                'condicionescomerciales': Kml3Url.serviceRestCondicionesComerciales,
                'configuraciones': Kml3Url.serviceRestConfiguraciones,
                'control-configuraciones': Kml3Url.serviceRestControlConfiguraciones,
                'definiciones': Kml3Url.serviceRestDefiniciones,
                'facturacion': Kml3Url.serviceRestFacturacion,
                'financiacion': Kml3Url.serviceRestFinanciacion,
                'gestion-cliente': Kml3Url.serviceRestGestionDelCliente,
                'gestiondeuda': Kml3Url.serviceRestGestionDeuda,
                'informes': Kml3Url.serviceRestInformes,
                'informes/reportes/camaleon': Kml3Url.serviceRestInformesReportes,
                'inventario': Kml3Url.serviceRestInventario,
                'interfaces': Kml3Url.serviceRestInterfaces,
                'limite-credito': Kml3Url.serviceRestLimiteCredito,
                'procesos-masivos': Kml3Url.serviceRestProcesosMasivos,
                'mayorista': Kml3Url.serviceRestMayorista,
                'ordenes-trabajo': Kml3Url.serviceRestMayorista,
                'personas': Kml3Url.serviceRestPersonas,
                'planificador': Kml3Url.serviceRestPlanificador,
                'politicas': Kml3Url.serviceRestPoliticas,
                'portabilidadnumerica': Kml3Url.serviceRestPortabilidadNumerica,
                'postventa': Kml3Url.serviceRestPostVenta,
                'precios': Kml3Url.serviceRestPrecios,
                'promociones': Kml3Url.serviceRestPromociones,
                'reparaciones': Kml3Url.serviceRestReparaciones,
                'ventas': Kml3Url.serviceRestVentas,
                'framework-integracion': Kml3Url.serviceRestFrameworkIntegracion,
                'konfigurator': Kml3Url.serviceKonfigurator,
                'wiki-crm': Kml3Url.serviceRestWiki
            },

            /**
            * Esta función debe ser sobreescrita por el servicio concreto.
            */
            getServiceRestUrl: function () { 
                return '';
            },

            getURI: function (uri) {
                return $http.get(uri);
            },

            /**
             * Esta función obtiene un Recurso del Backend
             * @params key código del Recurso
             * @param path
             * @return {Object} wrapper request response del Backend
             */
            get: function (key, path) {
                var urlServicioRest = this.getServiceRestUrl() + path
                    + '?keyParam= ' + encodeURIComponent(JSON.stringify(key));
                var customResult = {};
                return $http.get(urlServicioRest, {}).then(
                    function (succesResults) {
                        customResult = {
                            status: succesResults.status,
                            data: succesResults.data
                        };
                        return customResult;
                    },
                    function (failResults) {
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
             * @param key
             * @param path
             * @returns {objeto a JSON para que sea utlizable}
             */
            getSync: function (key, path) {
                var urlServicioRest = this.getServiceRestUrl() + path
                    + '?keyParam= ' + encodeURIComponent(JSON.stringify(key));
                var response = synchronousRequestServices.synchronousRequest("GET", urlServicioRest, "Content-Type");
                return response;
            },

            /**
             * Esta función se encarga de invocar al servicio RESTful para la creación de
             * un Recurso
             * @params datos los necesarios para la creación de un recurso
             * @param path
             * @return {Object} request response del Backend
             */
            insertar: function (datos, path) {
                var urlServicioRest = this.getServiceRestUrl() + path;
                $http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
                return $http.post(urlServicioRest, datos, {}).then(
                    function (succesResults) {
                        var customResult = {
                            status: succesResults.status,
                            data: succesResults.data,
                            headers: succesResults.headers
                        };
                        return customResult;
                    }, function (failResults) {
                        var customResult = {
                            status: failResults.status,
                            data: failResults.data
                        };
                        return customResult;
                    }
                )
            },

            /**
             * Permite listar los datos de acuerdo al filtro enviado(genérico)
             * @param filtros
             * @param inicio
             * @param cantidad
             * @param orderBy
             * @param orderDir
             * @param path
             * @param modulo
             * @returns {*}
             */
            listarGenerico: function (filtros, inicio, cantidad, orderBy, orderDir, path, modulo) {
                var filtrosJson = angular.toJson(filtros);
                // si se reciben filtros (no solamente {} o null)
                if ((filtrosJson.length > 2) && (filtros != null)) {
                    // nunca debería pasarse filtros más la condición de listartodo (-1), son excluyentes
                    if (cantidad === -1) {
                        cantidad = null;
                    }
                } else {
                    filtrosJson = null;
                }
                var queryParams = {};
                queryParams['filtros'] = filtrosJson;

                if (inicio != null) {
                    queryParams['inicio'] = inicio;
                }

                if (cantidad != null) {
                    queryParams['cantidad'] = cantidad;
                }

                if (orderBy != null) {
                    queryParams['orderBy'] = orderBy;
                }

                if (orderDir != null) {
                    queryParams['orderDir'] = orderDir;
                }

                var urlServicioRest = this.serviceRestUrlMap[modulo] + path;

                return $http.get(urlServicioRest, {
                    params: queryParams
                }).then(
                    function (succesResults) {
                        var lista;
                        if (succesResults.data.lista == undefined) {
                            lista = succesResults.data
                        } else {
                            lista = succesResults.data.lista
                        }

                        var customResult = {
                            status: succesResults.status,
                            data: lista,
                            headers: succesResults.headers
                        };
                        return customResult;
                    },
                    function (failResults) {
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
             * @params datos los necesarios para la modificación de un recurso
             * @param path
             * @return {Object} wrapper request response del Backend
             */
            modificar: function (datos, path) {
                var urlServicioRest = this.getServiceRestUrl() + path;
                $http.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
                return $http.put(
                    urlServicioRest, datos, {}).then(
                    function (succesResults) {
                        var customResult = {
                            status: succesResults.status,
                            data: succesResults.data
                        };
                        return customResult;
                    }, function (failResults) {
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
             * @param key
             * @params path la URI
             * @return {Object} request response del Backend
             */
            eliminar: function (key, path) {
                var urlServicioRest =this.getServiceRestUrl() + path
                    + '?keyParam= ' + encodeURIComponent(JSON.stringify(key));
                return $http.delete(urlServicioRest, {}).then(
                    function (succesResults) {
                        var customResult = {
                            status: succesResults.status,
                            data: succesResults.data
                        };
                        return customResult;
                    }, function (failResults) {
                        var customResult = {
                            status: failResults.status,
                            data: failResults.data
                        };
                        return customResult;
                    }
                )
            }

        }
    }
]);