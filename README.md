# Flux-Reactions
A library to make easier the communication among React.js components using events.

Using events, a dispatcher is not needed anymore to create an app that follows a Flux architecture. Components emit DOM events and actions are listeners added to the document in order to react to those events, that's is why this library is called *Reactions*.

Since events are available in every browser, react.js components don't need to be attached to any library method to communicate with the rest of the page, that makes components 100% encapsulated and reusable.

*Flux-Reactions* is just an utility to reduce the boilerplate of dispatch custom events cross-browser, not a complete Flux implementation.