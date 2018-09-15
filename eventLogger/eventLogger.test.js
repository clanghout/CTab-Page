const eventLogger = require('./eventLogger');

// jest cleanup el.reset();
// startup: el = eventLogger;

test('add event to empty log', () => {
    const el = eventLogger;
    el.addEvent("kaas");
    expect(el.eventLog).toEqual(["kaas"]);
});

test('add two events to empty log', () => {
    const el = eventLogger;
    el.addEvent("kaas");
    el.addEvent("tweede");
    expect(el.eventLog).toEqual(["kaas","tweede"]);
});
