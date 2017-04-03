/**
 *
 * @mail     <a href="mailto:juan.benitez@konecta.com.py"/>
 * @author   <a juan benitez</>
 */
app.factory('PruebaServices', ['$http',
    function ($http) {
        var PruebaServices = {};
        PruebaServices.getServiceRestUrl = function () {
            return MasterUrl.serviceRest;
        };

        PruebaServices.getPrueba = function () {
            var urlServicioRest = this.getServiceRestUrl() + 'prueba';
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
        };
        return PruebaServices;
    }
]);