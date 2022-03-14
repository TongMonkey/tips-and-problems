
        (function(modules){
            function require(id){
                const [fn, mapping] = modules[id];
                function localRequire(relativePath){
                    let id = mapping[relativePath];
                    return require(id);
                };
                const module = {
                    exports:{}
                };
                fn(localRequire,module,module.exports);
                return module.exports;
            }
            require(0);
        })({
            0: [
                function(require, module, exports){
                    "use strict";

var _info = _interopRequireDefault(require("./info.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import a from './consts.js';
console.log(_info["default"]);
                },
                {"./info.json":1}
            ],
        
            1: [
                function(require, module, exports){
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = "{\n  \"name\": \"xxt\"\n}\n";
exports["default"] = _default;
                },
                {}
            ],
        });
    