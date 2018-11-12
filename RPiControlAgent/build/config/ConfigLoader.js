"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var ConfigLoader = /** @class */ (function () {
    function ConfigLoader() {
    }
    ConfigLoader.prototype.loadConfig = function (environment) {
        if (environment != 'DEV' && environment != 'PROD') {
            throw new Error('invalid environment specified: not DEV or PROD');
        }
        var filePath = path.join(__dirname, "../../config/config." + environment.toLowerCase() + ".json");
        var configFileContext = fs.readFileSync(filePath).toString();
        return JSON.parse(configFileContext);
    };
    return ConfigLoader;
}());
exports.default = new ConfigLoader();
//# sourceMappingURL=ConfigLoader.js.map