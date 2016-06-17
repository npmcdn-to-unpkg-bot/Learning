"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var view_1 = require('angular2/src/core/linker/view');
var exceptions_1 = require('angular2/src/facade/exceptions');
var InterpretiveAppViewInstanceFactory = (function () {
    function InterpretiveAppViewInstanceFactory() {
    }
    InterpretiveAppViewInstanceFactory.prototype.createInstance = function (superClass, clazz, args, props, getters, methods) {
        if (superClass === view_1.AppView) {
            return new _InterpretiveAppView(args, props, getters, methods);
        }
        throw new exceptions_1.BaseException("Can't instantiate class " + superClass + " in interpretative mode");
    };
    return InterpretiveAppViewInstanceFactory;
}());
exports.InterpretiveAppViewInstanceFactory = InterpretiveAppViewInstanceFactory;
var _InterpretiveAppView = (function (_super) {
    __extends(_InterpretiveAppView, _super);
    function _InterpretiveAppView(args, props, getters, methods) {
        _super.call(this, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        this.props = props;
        this.getters = getters;
        this.methods = methods;
    }
    _InterpretiveAppView.prototype.createInternal = function (rootSelector) {
        var m = this.methods.get('createInternal');
        if (lang_1.isPresent(m)) {
            return m(rootSelector);
        }
        else {
            return _super.prototype.createInternal.call(this, rootSelector);
        }
    };
    _InterpretiveAppView.prototype.injectorGetInternal = function (token, nodeIndex, notFoundResult) {
        var m = this.methods.get('injectorGetInternal');
        if (lang_1.isPresent(m)) {
            return m(token, nodeIndex, notFoundResult);
        }
        else {
            return _super.prototype.injectorGet.call(this, token, nodeIndex, notFoundResult);
        }
    };
    _InterpretiveAppView.prototype.destroyInternal = function () {
        var m = this.methods.get('destroyInternal');
        if (lang_1.isPresent(m)) {
            return m();
        }
        else {
            return _super.prototype.destroyInternal.call(this);
        }
    };
    _InterpretiveAppView.prototype.dirtyParentQueriesInternal = function () {
        var m = this.methods.get('dirtyParentQueriesInternal');
        if (lang_1.isPresent(m)) {
            return m();
        }
        else {
            return _super.prototype.dirtyParentQueriesInternal.call(this);
        }
    };
    _InterpretiveAppView.prototype.detectChangesInternal = function (throwOnChange) {
        var m = this.methods.get('detectChangesInternal');
        if (lang_1.isPresent(m)) {
            return m(throwOnChange);
        }
        else {
            return _super.prototype.detectChangesInternal.call(this, throwOnChange);
        }
    };
    return _InterpretiveAppView;
}(view_1.AppView));
//# sourceMappingURL=interpretive_view.js.map