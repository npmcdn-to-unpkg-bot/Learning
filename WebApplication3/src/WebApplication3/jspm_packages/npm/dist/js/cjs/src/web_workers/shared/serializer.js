"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var lang_1 = require("angular2/src/facade/lang");
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require("angular2/src/facade/collection");
var api_1 = require("angular2/src/core/render/api");
var di_1 = require("angular2/src/core/di");
var render_store_1 = require('angular2/src/web_workers/shared/render_store');
var view_1 = require('angular2/src/core/metadata/view');
var serialized_types_1 = require('./serialized_types');
// PRIMITIVE is any type that does not need to be serialized (string, number, boolean)
// We set it to String so that it is considered a Type.
exports.PRIMITIVE = String;
var Serializer = (function () {
    function Serializer(_renderStore) {
        this._renderStore = _renderStore;
    }
    Serializer.prototype.serialize = function (obj, type) {
        var _this = this;
        if (!lang_1.isPresent(obj)) {
            return null;
        }
        if (lang_1.isArray(obj)) {
            return obj.map(function (v) { return _this.serialize(v, type); });
        }
        if (type == exports.PRIMITIVE) {
            return obj;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.serialize(obj);
        }
        else if (type === api_1.RenderComponentType) {
            return this._serializeRenderComponentType(obj);
        }
        else if (type === view_1.ViewEncapsulation) {
            return lang_1.serializeEnum(obj);
        }
        else if (type === serialized_types_1.LocationType) {
            return this._serializeLocation(obj);
        }
        else {
            throw new exceptions_1.BaseException("No serializer for " + type.toString());
        }
    };
    Serializer.prototype.deserialize = function (map, type, data) {
        var _this = this;
        if (!lang_1.isPresent(map)) {
            return null;
        }
        if (lang_1.isArray(map)) {
            var obj = [];
            map.forEach(function (val) { return obj.push(_this.deserialize(val, type, data)); });
            return obj;
        }
        if (type == exports.PRIMITIVE) {
            return map;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.deserialize(map);
        }
        else if (type === api_1.RenderComponentType) {
            return this._deserializeRenderComponentType(map);
        }
        else if (type === view_1.ViewEncapsulation) {
            return view_1.VIEW_ENCAPSULATION_VALUES[map];
        }
        else if (type === serialized_types_1.LocationType) {
            return this._deserializeLocation(map);
        }
        else {
            throw new exceptions_1.BaseException("No deserializer for " + type.toString());
        }
    };
    Serializer.prototype.mapToObject = function (map, type) {
        var _this = this;
        var object = {};
        var serialize = lang_1.isPresent(type);
        map.forEach(function (value, key) {
            if (serialize) {
                object[key] = _this.serialize(value, type);
            }
            else {
                object[key] = value;
            }
        });
        return object;
    };
    /*
     * Transforms a Javascript object (StringMap) into a Map<string, V>
     * If the values need to be deserialized pass in their type
     * and they will be deserialized before being placed in the map
     */
    Serializer.prototype.objectToMap = function (obj, type, data) {
        var _this = this;
        if (lang_1.isPresent(type)) {
            var map = new collection_1.Map();
            collection_1.StringMapWrapper.forEach(obj, function (val, key) { map.set(key, _this.deserialize(val, type, data)); });
            return map;
        }
        else {
            return collection_1.MapWrapper.createFromStringMap(obj);
        }
    };
    Serializer.prototype._serializeLocation = function (loc) {
        return {
            'href': loc.href,
            'protocol': loc.protocol,
            'host': loc.host,
            'hostname': loc.hostname,
            'port': loc.port,
            'pathname': loc.pathname,
            'search': loc.search,
            'hash': loc.hash,
            'origin': loc.origin
        };
    };
    Serializer.prototype._deserializeLocation = function (loc) {
        return new serialized_types_1.LocationType(loc['href'], loc['protocol'], loc['host'], loc['hostname'], loc['port'], loc['pathname'], loc['search'], loc['hash'], loc['origin']);
    };
    Serializer.prototype._serializeRenderComponentType = function (obj) {
        return {
            'id': obj.id,
            'templateUrl': obj.templateUrl,
            'slotCount': obj.slotCount,
            'encapsulation': this.serialize(obj.encapsulation, view_1.ViewEncapsulation),
            'styles': this.serialize(obj.styles, exports.PRIMITIVE)
        };
    };
    Serializer.prototype._deserializeRenderComponentType = function (map) {
        return new api_1.RenderComponentType(map['id'], map['templateUrl'], map['slotCount'], this.deserialize(map['encapsulation'], view_1.ViewEncapsulation), this.deserialize(map['styles'], exports.PRIMITIVE));
    };
    Serializer = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof render_store_1.RenderStore !== 'undefined' && render_store_1.RenderStore) === 'function' && _a) || Object])
    ], Serializer);
    return Serializer;
    var _a;
}());
exports.Serializer = Serializer;
var RenderStoreObject = (function () {
    function RenderStoreObject() {
    }
    return RenderStoreObject;
}());
exports.RenderStoreObject = RenderStoreObject;
//# sourceMappingURL=serializer.js.map