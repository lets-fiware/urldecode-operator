/*
 * urldecode
 * https://github.com/lets-fiware/urldecode-operator
 *
 * Copyright (c) 2020-2024 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var parseInputEndpointData = function parseInputEndpointData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }
        }

        if (typeof data !== "object") {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }

        return data;
    };

    var decode = function decode(str) {
        if (typeof str === "string") {
            str = str.replace(/%25/g, '%').replace(/%3d/g, '=').replace(/%27/g, '\'').replace(/%28/g, '(').replace(/%29/g, ')').replace(/%3c/g, '<').replace(/%3e/g, '>').replace(/%22/g, '"').replace(/%3b/g, ';');
        }
        return str;
    }

    var urldecodeData = function urldecodeData(event_data) {
        var data = parseInputEndpointData(event_data);
        if (data == null) {
            if (MashupPlatform.prefs.get("send_nulls")) {
                MashupPlatform.wiring.pushEvent('outputData', null);
            }
            return;
        }

        var new_data = {};

        for (var key in data) {
            new_data[key] = decode(data[key]);
        }
        MashupPlatform.wiring.pushEvent('outputData', new_data);
    };

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback('inputData', urldecodeData);
    }

    /* test-code */
    window.urldecodeData = urldecodeData;
    /* end-test-code */

})();
