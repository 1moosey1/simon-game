/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(26);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(24);

var _GamePiece = __webpack_require__(9);

var _GamePiece2 = _interopRequireDefault(_GamePiece);

var _GameConsole = __webpack_require__(6);

var _GameConsole2 = _interopRequireDefault(_GameConsole);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioLink = "https://s3.amazonaws.com/freecodecamp/";

module.exports = React.createClass({
    displayName: 'exports',


    sounds: [], pattern: [],
    patternIndex: 0, displayingPattern: false,
    userIndex: 0,

    getInitialState: function getInitialState() {

        // Initialize sounds
        this.sounds = [new Audio(audioLink + "simonSound1.mp3"), // Green sound effect
        new Audio(audioLink + "simonSound2.mp3"), // Red sound effect
        new Audio(audioLink + "simonSound3.mp3"), // Yellow sound effect
        new Audio(audioLink + "simonSound4.mp3") // Blue sound effect
        ];

        return {

            power: false, strict: false, count: 0,
            forceGreen: false, forceRed: false,
            forceYellow: false, forceBlue: false
        };
    },

    getPower: function getPower() {
        return this.state.power;
    },

    getStrict: function getStrict() {
        return this.state.strict;
    },

    getCount: function getCount() {
        return this.state.count;
    },

    togglePower: function togglePower() {

        if (this.state.power) {

            this.setState({

                power: false, strict: false, count: 0,
                forceGreen: false, forceRed: false,
                forceYellow: false, forceBlue: false
            });
        } else {

            this.resetGame();
            this.setState({ power: true }, this.startLevel);
        }
    },

    toggleStrict: function toggleStrict() {

        if (this.state.power) this.setState({ strict: !this.state.strict });
    },

    // Called when the game pieces are pressed
    onPress: function onPress(evtObj) {

        // Only play sounds when power is on and not displaying level
        if (this.state.power && !this.displayingPattern) {

            var id = parseInt(evtObj.target.id);

            this.playSound(id);
            this.checkInput(id);
        }
    },

    // Play a sound with event listener disabled
    playSound: function playSound(id) {

        this.sounds[id].pause();
        this.sounds[id].currentTime = 0;
        this.sounds[id].play();
    },

    checkInput: function checkInput(id) {

        // Check if the user pressed the correct button
        if (this.pattern[this.userIndex] === id) {

            this.userIndex++;

            // Check if the level is complete
            if (this.userIndex === this.pattern.length) this.nextLevel(1000);
        }

        // User pressed wrong button
        else {

                if (this.state.strict) this.resetGame();

                this.restartLevel();
            }
    },

    expandPattern: function expandPattern() {

        // Generate and add the new button to pattern
        var randBtn = Math.floor(Math.random() * 4);
        this.pattern.push(randBtn);
    },

    nextLevel: function nextLevel() {
        var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


        this.expandPattern();
        this.setState({ count: ++this.state.count });
        window.setTimeout(this.startLevel, delay);
    },

    restartLevel: function restartLevel() {

        this.displayingPattern = true;
        window.setTimeout(this.startLevel, 1000);
    },

    startLevel: function startLevel() {

        this.userIndex = 0;
        this.patternIndex = 0;
        this.displayingPattern = true;
        this.displayPattern();
    },

    // Prepare next button to be displayed
    prepareDisplay: function prepareDisplay() {

        // Stop simulating button press
        if (this.state.forceGreen) this.setState({ forceGreen: false });else if (this.state.forceRed) this.setState({ forceRed: false });else if (this.state.forceYellow) this.setState({ forceYellow: false });else if (this.state.forceBlue) this.setState({ forceBlue: false });

        // Move to the next button to be displayed
        this.patternIndex++;

        // Check if there is a next button to be displayed
        if (this.state.power && this.patternIndex < this.pattern.length) {

            // Wait 350 milliseconds before displaying next button
            window.setTimeout(this.displayPattern, 350);
        } else this.displayingPattern = false;
    },

    displayPattern: function displayPattern() {

        // Display next button in the pattern and play associated sound
        var btnValue = this.pattern[this.patternIndex],
            soundDuration = this.sounds[btnValue].duration * 1000;

        if (btnValue === 0) this.setState({ forceGreen: true });else if (btnValue === 1) this.setState({ forceRed: true });else if (btnValue === 2) this.setState({ forceYellow: true });else if (btnValue === 3) this.setState({ forceBlue: true });

        this.playSound(btnValue);
        window.setTimeout(this.prepareDisplay, soundDuration);
    },

    resetGame: function resetGame() {

        this.setState({ count: 1 });
        this.pattern = [];
        this.expandPattern();
    },

    render: function render() {

        return React.createElement(
            'div',
            { className: 'bgc' },
            React.createElement(_GamePiece2.default, { className: 'green-btn', id: '0',
                onPress: this.onPress,
                power: this.getPower,
                forceDisplay: this.state.forceGreen }),
            React.createElement(_GamePiece2.default, { className: 'red-btn', id: '1',
                onPress: this.onPress,
                power: this.getPower,
                forceDisplay: this.state.forceRed }),
            React.createElement(_GamePiece2.default, { className: 'yellow-btn', id: '2',
                onPress: this.onPress,
                power: this.getPower,
                forceDisplay: this.state.forceYellow }),
            React.createElement(_GamePiece2.default, { className: 'blue-btn', id: '3',
                onPress: this.onPress,
                power: this.getPower,
                forceDisplay: this.state.forceBlue }),
            React.createElement(_GameConsole2.default, {
                power: this.getPower,
                strict: this.getStrict,
                count: this.getCount,
                togglePower: this.togglePower,
                toggleStrict: this.toggleStrict })
        );
    }
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _header = __webpack_require__(25);

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = React.createClass({
    displayName: 'exports',


    render: function render() {

        return React.createElement(
            'header',
            null,
            React.createElement(
                'h1',
                null,
                ' Simon Game '
            )
        );
    }
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(19);

module.exports = function () {

    return React.createElement(
        'footer',
        null,
        'Code and Design by',
        React.createElement('br', null),
        'Juan Gonzalez'
    );
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(20);

var _GameCounter = __webpack_require__(8);

var _GameCounter2 = _interopRequireDefault(_GameCounter);

var _GameControls = __webpack_require__(7);

var _GameControls2 = _interopRequireDefault(_GameControls);

var _Footer = __webpack_require__(5);

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = React.createClass({
    displayName: 'exports',


    render: function render() {

        return React.createElement(
            'div',
            { className: 'fgc' },
            React.createElement(_GameCounter2.default, {
                power: this.props.power,
                count: this.props.count }),
            React.createElement(_GameControls2.default, {
                power: this.props.power,
                strict: this.props.strict,
                togglePower: this.props.togglePower,
                toggleStrict: this.props.toggleStrict }),
            React.createElement(_Footer2.default, null)
        );
    }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(21);

module.exports = React.createClass({
    displayName: "exports",


    render: function render() {

        var powerClass = "switch";
        if (this.props.power()) powerClass += "-on";

        var strictClass = "switch";
        if (this.props.strict()) strictClass += "-on";

        return React.createElement(
            "div",
            { className: "control-container" },
            React.createElement(
                "div",
                { className: "inline" },
                React.createElement("button", { className: powerClass,
                    onClick: this.props.togglePower }),
                React.createElement(
                    "div",
                    null,
                    " On/Off "
                )
            ),
            React.createElement(
                "div",
                { className: "inline" },
                React.createElement("button", { className: strictClass,
                    onClick: this.props.toggleStrict }),
                React.createElement(
                    "div",
                    null,
                    " Strict "
                )
            )
        );
    }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(22);

module.exports = React.createClass({
    displayName: "exports",


    render: function render() {

        var className = "counter";
        if (this.props.power()) className += "-on";

        return React.createElement(
            "div",
            { className: "counter-container" },
            React.createElement(
                "div",
                { className: className },
                " ",
                this.props.count(),
                " "
            ),
            React.createElement(
                "div",
                null,
                " COUNT "
            )
        );
    }
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(23);

module.exports = React.createClass({
    displayName: "exports",


    render: function render() {

        var className = this.props.className;

        // If forcing "simulating press" then change css to reflect
        if (this.props.forceDisplay) {
            className += "-force";
        }

        // If game is on then allow css active pseudo element
        else if (this.props.power()) className += "-on";

        return React.createElement(
            "div",
            { className: className, id: this.props.id,
                onMouseDown: this.props.onPress },
            " "
        );
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

var _Header = __webpack_require__(3);

var _Header2 = _interopRequireDefault(_Header);

var _Game = __webpack_require__(2);

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimonApp = React.createClass({
    displayName: 'SimonApp',


    render: function render() {

        return React.createElement(
            'div',
            null,
            React.createElement(_Header2.default, null),
            React.createElement(_Game2.default, null)
        );
    }
});

ReactDOM.render(React.createElement(SimonApp, null), document.getElementById("simon-app"));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "footer {\n  position: inherit;\n  left: 0px;\n  right: 0px;\n  bottom: 25px;\n  text-align: center; }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".fgc {\n  width: 250px;\n  height: 250px;\n  top: 120px;\n  border-radius: 50%;\n  position: absolute;\n  margin-left: auto;\n  margin-right: auto;\n  left: 0px;\n  right: 0px;\n  background-color: white;\n  box-shadow: none;\n  border-style: solid;\n  border-width: 10px;\n  border-color: black; }\n", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".control-container {\n  position: inherit;\n  top: 70px;\n  right: 10px;\n  text-align: center; }\n\n.inline {\n  display: inline-block;\n  margin-left: 5px;\n  margin-right: 5px; }\n\n.switch, .switch-on {\n  width: 25px;\n  height: 25px;\n  border-radius: 50%;\n  outline: none !important;\n  background-color: #cc0000; }\n\n.switch-on {\n  background-color: #ff0000;\n  box-shadow: 0px 0px 5px 1px #ff0000; }\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".counter-container {\n  width: 65px;\n  position: inherit;\n  top: 50px;\n  left: 35px;\n  text-align: center; }\n\n.counter, .counter-on {\n  font-family: \"Terminal Dosis\";\n  font-size: 40px;\n  line-height: 50px;\n  color: #cc0000;\n  background-color: #000000;\n  box-shadow: inset 0px 0px 3px 1px silver; }\n\n.counter-on {\n  color: #ff0000;\n  text-shadow: 0px 0px 15px #ff0000; }\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".game-btn, .green-btn, .green-btn-force, .green-btn-on, .red-btn, .red-btn-force, .red-btn-on, .yellow-btn, .yellow-btn-force, .yellow-btn-on, .blue-btn, .blue-btn-force, .blue-btn-on {\n  width: 215px;\n  height: 215px;\n  position: inherit; }\n\n.green-btn, .green-btn-force, .green-btn-on {\n  top: 25px;\n  left: 25px;\n  border-top-left-radius: 100%;\n  background-color: #006600; }\n\n.green-btn-force {\n  background-color: #4ca64c;\n  box-shadow: 0 0 14px 4px #4ca64c; }\n\n.green-btn-on:active {\n  background-color: #4ca64c;\n  box-shadow: 0 0 14px 4px #4ca64c; }\n\n.red-btn, .red-btn-force, .red-btn-on {\n  top: 25px;\n  right: 25px;\n  border-top-right-radius: 100%;\n  background-color: #cc0000; }\n\n.red-btn-force {\n  background-color: #ff4c4c;\n  box-shadow: 0 0 14px 4px #ff4c4c; }\n\n.red-btn-on:active {\n  background-color: #ff4c4c;\n  box-shadow: 0 0 14px 4px #ff4c4c; }\n\n.yellow-btn, .yellow-btn-force, .yellow-btn-on {\n  bottom: 25px;\n  left: 25px;\n  border-bottom-left-radius: 100%;\n  background-color: #cccc00; }\n\n.yellow-btn-force {\n  background-color: #ffff4c;\n  box-shadow: 0 0 14px 4px #ffff4c; }\n\n.yellow-btn-on:active {\n  background-color: #ffff4c;\n  box-shadow: 0 0 14px 4px #ffff4c; }\n\n.blue-btn, .blue-btn-force, .blue-btn-on {\n  bottom: 25px;\n  right: 25px;\n  border-bottom-right-radius: 100%;\n  background-color: #0000cc; }\n\n.blue-btn-force {\n  background-color: #4c4cff;\n  box-shadow: 0 0 14px 4px #4c4cff; }\n\n.blue-btn-on:active {\n  background-color: #4c4cff;\n  box-shadow: 0 0 14px 4px #4c4cff; }\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".bgc {\n  width: 500px;\n  height: 500px;\n  border-radius: 50%;\n  position: absolute;\n  margin-left: auto;\n  margin-right: auto;\n  left: 0px;\n  right: 0px;\n  background-color: black;\n  box-shadow: 0px 0px 20px 1px #000; }\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "header {\n  text-align: center;\n  margin: 20px; }\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  background-color: #e4d1bf; }\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./footer.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./footer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gameconsole.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gameconsole.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gamecontrols.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gamecontrols.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gamecounter.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gamecounter.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gamepiece.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./gamepiece.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./game.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./game.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./header.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./header.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);