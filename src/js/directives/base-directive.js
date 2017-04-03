/**
 * @mail     <a href="mailto:juan.benitez@konecta.com.py"/>
 * @author   <a juan benitez</>
 */

/**
 * directiva Base para las grillas con filtrado
 */
app.directive('listaDirective', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../module/base/partials/listado-base.html'
    };
});

/**
 * Directiva Base para los formularios de carga y edición
 */
app.directive('abmDirective', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '../../module/base/partials/abm-base.html'
    };
});