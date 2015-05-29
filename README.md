# Flux-Reactions
A library to make easier the communication among React.js components using events.

Using events, a dispatcher is not needed anymore to create an app that follows a Flux architecture. Components emit DOM events and actions are listeners added to the document in order to react to those events, that's is why this library is called *Reactions*.

Since events are available in every browser, react.js components don't need to be attached to any library method to communicate with the rest of the page, that makes components 100% encapsulated and reusable.

*Flux-Reactions* is just an utility to reduce the boilerplate of dispatch custom events cross-browser, not a complete Flux implementation.

See [A better Flux with DOM events](http://arqex.com/1028/better-flux-dom-events) to know the benefits of this approach.

## Install
*Flux-reactions* comes in the shape of a UMD module to be used in Node.js and the browser. It is possible to install it using npm
```
npm install flux-reactions
```
Using bower
```
bower install flux-reactions
```
Or adding it directly to your page code for development [flux-reactions.js](https://raw.githubusercontent.com/arqex/flux-reactions/master/flux-reactions.js)(5KB), and minified [flux-reactions.min.js](https://raw.githubusercontent.com/arqex/flux-reactions/master/flux-reactions.min.js)(1KB).

## Use
*Flux-reactions* comes with a mixin for React.js modules that allows to emit events easily using the `trigger` method. Let's create a counter component that emit an `increment` event whenever its button is clicked.
```js
var Counter  = React.createClass({
    // Add the reaction mixin
    mixins: [Reactions.mixin],
    render: function(){
        return (
            <div className="counter">
                <span>{this.props.count}</span>
                <button onClick={ this.onIncrease }>Increase</button>
            </div>
        );
    },
    onIncrease: function(){
        // Emit an increase event with 1 as detail
        this.trigger('increase', 1);
    }
});
```
To create a reaction to the event, we can use the Reaction object as a hub.
```
Reactions.on( 'increase', function( e ){
    // Add the number passed as detail to the 
    // counter store ( 1 in this example)
    store.counter += e.detail;
});
```

The mixin also allow to listen to events emited by children components. Imagine a selectable list:
```js
var List = React.createClass({
    mixins:[Reactions.mixin],
    // Events to listen are defined in the onEvents attribute
    onEvents: {
        // Add a listener to the selected event
        selected: function(e){
            // Select the item that emitted the event
            this.setState({selected: e.detail});
        }
    },
    getInitialState: function(){
        return {selected: -1};
    },
    render: function(){
        // Create a list of 3 items
        var items = [0,1,2].map( function( i ){
            return <Item text={ 'Item ' + i} index={ i } selected={ this.state.selected == i} />;
        });
        return <div>{ items }</div>;
    }
});
var Item = React.createClass({
    mixins:[Reactions.mixin],
    render: function(){
        return (
            // thenTrigger will emit a selected event on click
            <div onClick={ this.thenTrigger( 'selected', this.props.index ) }>
                { this.props.text }
            </div>
        );
    }
})
```

## API
### Reactions.on( eventName, callback )
Add a listener to some event, AKA creates a reaction. The reaction will receive the event as the only argument.
```js
// Creates a reaction for the selected event
Reactions.on( 'selected', function( e ){
    console.log( 'Hey I am selected!');
});
```
### Reactions.once( eventName, callback )
Add a listener to some events that will be called just once.

### Reactions.off( eventName, callback )
Removes an event listener.

### Reactions.trigger( eventName, detail )
Flux dispatcher uses the `waitfor` method to synchronize different actions. Using flux-reaction you can trigger a new event whenever a reaction has finished to coordinate several reactions for an event.

### Reactions.mixin
A mixin to be used by react components. The mixin will add the following methods to the component:

#### trigger( eventName, detail )
Triggers the event in the DOM node of the component. The detail attribute of the event can be customized passing its value as the second argument.

#### thenTrigger( eventName, detail )
Returns a function than trigger the event with the given detail attribute. This is useful to trigger the event directly from the render method without creating a new function that does so.
```js
var Item = React.createClass({
    mixins:[Reactions.mixin],
    render: function(){
        return (
            // thenTrigger will emit a selected event on click
            <div onClick={ this.thenTrigger( 'selected', this.props.index ) }>
                { this.props.text }
            </div>
        );
    }
})
```

#### listenTo( eventName, callback )
Listen to children events.

#### onEvents
Event listeners for children can also defined declaratively by using the
component  `onEvents` attribute. That attribute must be an object with
the name of the events as keys and functions or name of methods of the
current component as values:
```js
onEvents: {
    selected: 'onSelected',
    removed: function(){
        console.log( 'removed' );
    }
}
```

A selected event on a children with trigger component's `onSelected` method.
A removed event will trigger the function defined.

Those listeners will be added in this componentDidMount method.

## Collaborate
This is a quick implementation of a crossbrowser event library to be used with React.js. There are some directions to work to:
* Add support for using EventEmitter make it work in the server.
* Study the alternatives to make it work with the future [React Native](https://code.facebook.com/videos/786462671439502/react-js-conf-2015-keynote-introducing-react-native-/).
* Add support for using it as a [higher order component](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775).

Any improvement that you may find is welcome.
