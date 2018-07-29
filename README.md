# VMM Bridge - A VueX to Mongo Bridge over MQTT

> DISCLAIMER: this is an experiment. If ever, until this disclaimer is removed, don't use the code in this repository, unless you know what you're doing ;-)

## Rationale

The goal of this experiment is to construct a transparant bridge between VueX and Mongo over MQTT. The most important part of this experiment is the definition of the protocol and modus operandi. The experiment will be implemented using Python, but other implementations are of course possible and ought to be interoperable when adhering to the protocol.

## Goal

TODO: add drawing ;-)

## Protocol Considerations

To trigger change, an application will publish update **requests**, which will update the Mongo store. These updates will trigger **events** that are published using MQTT.

These events will be picked up and merged into the local store (which might be VueX or another Mongo instance), resulting in an update. When publishing the request, the local store will be updated to reflect the pending change, until it is confirmed by the incoming event.

All request- and event-messages should be handled in an idempotent way to allow for multiple/redundant publishers and consumers to handle the same messages.

Updates sent out by the Mongo side, should be acknowledged. 

**Objects** contain a version. When receiving an update event, this event will contain the **current** and **new** version identifier of the object. This version identifier is a sequence number. This allows the consumer to check if its own version is the current and the update can be merged safely.

If an update event contains a version identifier that is different from the one at the consumer side, it will respond with a **failure** event, indicating the inability to merge due to an outdated local copy of the object. This event will contain the outdated version identifier, allowing the publisher to **replay** the missing events, before continuing.

The sequence of events will be maintained.

Publishers need to keep track of events and only send out the next event when the previous one has been successfully handled.

Any number of web or other clients should be able to join the overlay network.

## Action!

>  Make sure you have an MQTT broker running, with websocket support on port 9001.

```bash
$ make vue
*** creating virtual Python environment...
*** running webserver for Vue demo...
    use ctrl+c to terminate
 * Serving Flask app "vue.web" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: on
2018-07-29 17:54:44,181 - werkzeug   - [WARNI] -  * Debugger is active!
```
Visit [http://localhost:5000](http://localhost:5000).
