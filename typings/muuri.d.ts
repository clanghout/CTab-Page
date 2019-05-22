declare module 'Muuri' {

    declare interface MuuriOptions {
        items?: any
    }

    declare class Muuri {
        constructor(
            element: HTMLElement | String,
            options: MuuriOptions | any
        );
    }

    export default Muuri;
}


/* @class
* @param {(HTMLElement|String)} element
* @param {Object} [options]
* @param {(?HTMLElement[]|NodeList|String)} [options.items]
* @param {Number} [options.showDuration=300]
* @param {String} [options.showEasing="ease"]
* @param {Object} [options.visibleStyles]
* @param {Number} [options.hideDuration=300]
* @param {String} [options.hideEasing="ease"]
* @param {Object} [options.hiddenStyles]
* @param {(Function|Object)} [options.layout]
* @param {Boolean} [options.layout.fillGaps=false]
* @param {Boolean} [options.layout.horizontal=false]
* @param {Boolean} [options.layout.alignRight=false]
* @param {Boolean} [options.layout.alignBottom=false]
* @param {Boolean} [options.layout.rounding=true]
* @param {(Boolean|Number)} [options.layoutOnResize=100]
* @param {Boolean} [options.layoutOnInit=true]
* @param {Number} [options.layoutDuration=300]
* @param {String} [options.layoutEasing="ease"]
* @param {?Object} [options.sortData=null]
* @param {Boolean} [options.dragEnabled=false]
* @param {?HtmlElement} [options.dragContainer=null]
* @param {?Function} [options.dragStartPredicate]
* @param {Number} [options.dragStartPredicate.distance=0]
* @param {Number} [options.dragStartPredicate.delay=0]
* @param {(Boolean|String)} [options.dragStartPredicate.handle=false]
* @param {?String} [options.dragAxis]
* @param {(Boolean|Function)} [options.dragSort=true]
* @param {Number} [options.dragSortInterval=100]
* @param {(Function|Object)} [options.dragSortPredicate]
* @param {Number} [options.dragSortPredicate.threshold=50]
* @param {String} [options.dragSortPredicate.action="move"]
* @param {Number} [options.dragReleaseDuration=300]
* @param {String} [options.dragReleaseEasing="ease"]
* @param {Object} [options.dragHammerSettings={touchAction: "none"}]
* @param {String} [options.containerClass="muuri"]
* @param {String} [options.itemClass="muuri-item"]
* @param {String} [options.itemVisibleClass="muuri-item-visible"]
* @param {String} [options.itemHiddenClass="muuri-item-hidden"]
* @param {String} [options.itemPositioningClass="muuri-item-positioning"]
* @param {String} [options.itemDraggingClass="muuri-item-dragging"]
* @param {String} [options.itemReleasingClass="muuri-item-releasing"]

 */
