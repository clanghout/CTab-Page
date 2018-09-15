"use strict";

function eventLogger() {
    let el = {};
// Event
    el.eventLog = [];
    el.UndoStack = [];
    let eventLogState = getCurMax();

    el.reset = function () {
        el.eventLog = [];
        eventLogState = getCurMax();
    };

    function getCurMax() {
        return el.eventLog.reduce((acc, cur) => Math.max(acc, cur.index),0);
    }

    el.addEvent = function (event) {
        if(el.eventLog.length === eventLogState){
            el.eventLog.push(event);
            eventLogState++;
        }else {
            console.error("index error while adding to event log");
        }
    };

    el.insertEventLog = function (log){
        el.eventLog = log;
        eventLogState = getCurMax();
    };

    el.getFromIndex = function (index, curResult = []) {
        if(index >= eventLogState){
            return curResult;
        }
        curResult.push(el.eventLog[index]);
        return el.getFromIndex(index+1,curResult);
    };

    return el;
}

if(module) {
    module.exports = eventLogger();
}

// Comment out for running tests :s
// export {eventLogger};

