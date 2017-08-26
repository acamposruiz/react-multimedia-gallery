'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = require('aphrodite');

var Gallery = (function (_React$Component) {
    _inherits(Gallery, _React$Component);

    function Gallery() {
        _classCallCheck(this, Gallery);

        _get(Object.getPrototypeOf(Gallery.prototype), 'constructor', this).call(this);
        this.state = {
            containerWidth: 0
        };
        this.handleResize = this.handleResize.bind(this);
    }

    _createClass(Gallery, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
            window.addEventListener('resize', this.handleResize);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this._gallery.clientWidth !== this.state.containerWidth) {
                this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.handleResize, false);
        }
    }, {
        key: 'handleResize',
        value: function handleResize(e) {
            this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var cols = _props.cols;
            var margin = _props.margin;
            var items = _props.items;
            var onClickItem = _props.onClickItem;

            var containerWidth = this.state.containerWidth;

            var remainder = items.length % cols;

            // calculate the available space for the images by subtracting the margin space from the actual parent container width
            // the 2 is for each side of the image
            var containerSpace = Math.floor(containerWidth - cols * (margin * 2));
            var itemNode = [];
            var lastRowWidth = undefined;
            var lastRowIndex = undefined;

            if (remainder) {
                // there are fewer photos than cols num in last row
                lastRowWidth = Math.floor(containerWidth / cols * remainder - remainder * (margin * 2));
                lastRowIndex = items.length - remainder;
            }

            // loop thru each set of cols num
            // eg. if cols is 3 it will loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
            for (var i = 0; i < items.length; i += cols) {
                var totalAspectRatio = 0;
                var commonHeight = 0;

                // get the total aspect ratio of the row
                for (var j = i; j < i + cols; j++) {

                    if (!items[j]) {
                        break;
                    }

                    var _ref = items[j].type == 'photo' || items[j].type == 'video' ? items[j] : { width: 100, height: 100 };

                    var width = _ref.width;
                    var height = _ref.height;

                    if (j == items.length) {
                        break;
                    }
                    items[j].aspectRatio = width / height;
                    totalAspectRatio += items[j].aspectRatio;
                }
                if (i === lastRowIndex) {
                    commonHeight = lastRowWidth / totalAspectRatio;
                } else {
                    commonHeight = containerSpace / totalAspectRatio;
                }
                // run thru the same set of items again to give the width and common height
                for (var k = i; k < i + cols; k++) {
                    if (k == items.length) {
                        break;
                    }

                    items[k] = items[k] || {};

                    // explicity set the exact width of the image instead of letting the browser calculate it based on the height of the image
                    // because the browser may round up or down and cause the image to break to the next row if its even 1 pixel off
                    var width = commonHeight * items[k].aspectRatio;

                    style.margin = margin;

                    itemNode.push(this.renderItem(items[k], k, style, onClickItem, commonHeight, width));
                }
            }
            return this.renderGallery(itemNode);
        }
    }, {
        key: 'renderItem',
        value: function renderItem(item, k, style, onClickItem, commonHeight, width) {
            var oldIndex = item.oldIndex;

            if (item.type == 'photo') {

                var src = item.src;
                var alt = item.alt;

                var srcset = undefined;
                var sizes = undefined;

                if (item.srcset) {
                    srcset = item.srcset.join();
                }
                if (item.sizes) {
                    sizes = item.sizes.join();
                }

                return _react2['default'].createElement(
                    'div',
                    { 'data-type': 'photo', key: k, style: style },
                    _react2['default'].createElement(
                        'a',
                        { href: '#', className: k, onClick: function (e) {
                                return onClickItem(oldIndex, e, 'photos');
                            } },
                        _react2['default'].createElement('img', { src: src, srcSet: srcset, sizes: sizes, style: { display: 'block', border: 0 }, height: commonHeight, width: width, alt: alt })
                    )
                );
            } else if (item.type == 'video') {

                var src = item.src;

                var srcset = undefined;
                var sizes = undefined;

                if (item.srcset) {
                    srcset = item.srcset.join();
                }
                if (item.sizes) {
                    sizes = item.sizes.join();
                }

                return _react2['default'].createElement(
                    'div',
                    { className: 'video-item-container', 'data-type': 'video', key: k, style: style },
                    _react2['default'].createElement(
                        'a',
                        { href: '#', className: k, onClick: function (e) {
                                return onClickItem(oldIndex, e, 'videos');
                            } },
                        _react2['default'].createElement('img', { src: src, srcSet: srcset, sizes: sizes, style: { display: 'block', border: 0 }, height: commonHeight, width: width }),
                        _react2['default'].createElement(
                            'i',
                            { className: 'material-icons' },
                            'play_circle_outline'
                        )
                    )
                );
            } else if (item.type == 'article') {
                var content = item.content;
                return _react2['default'].createElement(
                    'div',
                    { 'data-type': 'article', key: k, style: style },
                    _react2['default'].createElement(
                        'a',
                        { href: '#', className: k, onClick: function (e) {
                                return onClickItem(oldIndex, e, 'articles');
                            } },
                        _react2['default'].createElement(
                            'span',
                            { style: { display: 'block', border: 0, height: commonHeight, width: width }, className: (0, _aphrodite.css)(this.textStyles(commonHeight, width).text_thumbail) },
                            content
                        )
                    )
                );
            }
        }
    }, {
        key: 'textStyles',
        value: function textStyles(commonHeight, width) {
            return _aphrodite.StyleSheet.create({

                // anchor
                text_thumbail: {
                    padding: '21px',
                    'box-sizing': 'border-box',
                    cursor: 'pointer',
                    height: commonHeight,
                    'text-align': 'justify',
                    'font-size': '20px',
                    width: width,
                    overflow: 'scroll',
                    'border-radius': '4px',
                    color: 'darkgray',

                    '@media (min-width: 500px)': {}
                }
            });
        }
    }, {
        key: 'renderGallery',
        value: function renderGallery(itemNodePreviewNodes) {
            var _this = this;

            return _react2['default'].createElement(
                'div',
                { id: 'Gallery', className: 'clearfix', ref: function (c) {
                        return _this._gallery = c;
                    } },
                itemNodePreviewNodes
            );
        }
    }]);

    return Gallery;
})(_react2['default'].Component);

;
Gallery.displayName = 'Gallery';
Gallery.propTypes = {
    items: _propTypes2['default'].array,
    onClickItem: _propTypes2['default'].func,
    cols: _propTypes2['default'].number,
    margin: _propTypes2['default'].number
};
Gallery.defaultProps = {
    cols: 3,
    onClickItem: function onClickItem(k, e) {
        e.preventDefault();
    },
    margin: 2
};
// Gallery image style
var style = {
    display: 'block',
    float: 'left'
};

var classes = _aphrodite.StyleSheet.create({

    // anchor
    text_thumbail: {
        cursor: 'pointer',
        height: '200px',
        'text-align': 'justify',
        'font-size': '16px',
        width: '46%',
        padding: '10px',
        margin: '10px',
        boxSizing: 'border-box',
        display: 'block',
        float: 'left',
        overflow: 'scroll',
        border: 'solid 1px #E6E6E8',
        'border-radius': '4px',
        color: 'darkgray',

        '@media (min-width: 500px)': {}
    }
});

exports['default'] = Gallery;
module.exports = exports['default'];