"use strict";

function grid() {
    var service = {};
    service.grid = $(".grid-stack");

    var options = {
        animate: true,
        cellHeight: 60,
        verticalMargin: 0,
        float: true,
        disableOneColumnMode: true,
        removable: true,
        width: 12
    };

    service.grid.gridstack(options);
    service.gridData = service.grid.data('gridstack');
    console.log(service.gridData);
    service.getSortedWidgets = function () {
        service.gridData.grid._sortNodes();
        var ids = [];
        _.map($('.grid-stack > .grid-stack-item:visible'),
            function (el) {
                el = $(el);
                ids.push(el.data('_gridstack_node')["id"]);
            });
        return ids;
    };

    service.removeWidget = function (id) {
        _.map($('.grid-stack > .grid-stack-item:visible'),
            function (el) {
                el = $(el);
                // id is saved in gridstack as a string while the parameter is an integer
                if (el.data('_gridstack_node')["id"] == id) {
                    service.gridData.removeWidget(el);
                }
            });
    };

    service.addWidgetToGrid = function (widget) {

        service.gridData.addWidget(
            widget.el,
            widget.x,
            widget.y,
            widget.width,
            widget.height,
            widget.autoPosition,
            widget.minWidth,
            widget.maxWidth,
            widget.minHeight,
            widget.maxHeight,
            widget.id);

    };

    service.widgetFactory = function () {
        return function (el, x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id) {
            // define the default properties of a gridstack widget
            console.log("tjos", this);
            this.el = (typeof el === 'undefined') ? "" : el;
            this.x = (typeof x === 'number') ? x : 0;
            this.y = (typeof y === 'number') ? y : 0;
            this.width = (typeof width === 'number') ? width : 1;
            this.height = (typeof height === 'number') ? height : 1;
            this.autoPosition = (typeof autoPosition === 'boolean') ? autoPosition : false;
            this.minWidth = (typeof minWidth === 'number') ? minWidth : 1;
            this.maxWidth = (typeof maxWidth === 'number') ? maxWidth : 2;
            this.minHeight = (typeof minHeight === 'number') ? minHeight : 1;
            this.maxHeight = (typeof maxHeight === 'number') ? maxHeight : 2;
            this.id = (typeof id === 'number') ? id : 0;
            // TODO: incremental id

            this.getConfig = function () {
                return {
                    "el": this.el,
                    "x": this.x,
                    "y": this.y,
                    "width": this.width,
                    "height": this.height,
                    "autoPosition": this.autoPosition,
                    "minWidth": this.minWidth,
                    "maxWidth": this.maxWidth,
                    "minHeight": this.minHeight,
                    "maxHeight": this.maxHeight
                };
            }
            console.log("adding widget", this.getConfig());
        }
    }
    return service;
}