(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(configFunction);
    core.config(requestsConfig);

    configFunction.$inject = ['toastr'];
    /* @ngInject */
    function configFunction(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    requestsConfig.$inject = ['$httpProvider'];
    /* @ngInject */
    function requestsConfig($httpProvider) {

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push(interceptor);
    }

    interceptor.$inject = ['config'];
    function interceptor(config) {
        return {
            request: function(requestConfig) {
                if (!isApiRequest(requestConfig.url)) {
                    return requestConfig;
                }

            },
            response: function (response) {
                if (isApiRequest(response.config.url)) {
                    console.log(response);
                }
                return response;
            },
            responseError: function (error, ajaxOptions, thrownError) {

            }
        };

        function isApiRequest(url) {
            return url.indexOf(config.domainProtocol + config.domainEndpoint + config.portEndpoint) === 0;
        }
    }

    var config = {
        appErrorPrefix: '[<%= appName %> Error] ',
        appTitle: '<%= appName %>',
        apiBaseUrl: '[[_DOMAIN_PROTOCOL_]]' + '[[_DOMAIN_ENDPOINT_]]' + '[[_PORT_ENDPOINT_]]',

        domainProtocol: '[[_DOMAIN_PROTOCOL_]]',
        domainEndpoint: '[[_DOMAIN_ENDPOINT_]]',
        portEndpoint: '[[_PORT_ENDPOINT_]]'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
    }

})();
