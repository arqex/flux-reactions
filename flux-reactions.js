/* flux-reactions v0.0.1 (24-2-2015)
 * https://github.com/arqex/flux-reactions.git
 * By arqex
 * License: GNU-v2
 */
( function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Reactions = factory();
	}
}( this, function() {
	'use strict';

	// The hub node to attach the event listener
	var hub = window.document;

	/**
	 * Crossbrowser implementation of adding an event listener to a node
	 * @param {DOMNode}   node      The node that will listen to the event
	 * @param {String}   eventName The event type
	 * @param {Function} fn        The callback on event triggered.
	 */
	var addListener = function( node, eventName, fn ){
		if ( node.addEventListener ) // W3C DOM
			node.addEventListener( eventName, fn, false );
		else if ( node.attachEvent ) // IE DOM
			node.attachEvent( 'on' + eventName, fn );
		else
			node[ 'on' + eventName ] = fn;
	};

	/**
	 * Crossbrowser implementation of removing an event listener from a node.
	 * @param  {DOMNode}   node      The node to remove the listener from
	 * @param  {String}   eventName The event type
	 * @param  {Function} fn        The callback to remove
	 */
	var removeListener = function( node, eventName, fn ){
		if ( node.removeEventListener )
			node.removeEventListener( eventName, fn, false );
		else if ( node.detachEvent )
			node.detachEvent ( 'on' + eventName, fn );
		else
			delete node[ 'on' + eventName ];
	};

	// The module that will be plublicly available
	var Reactions = {

		/**
		 * Add a reaction for an event
		 * @param  {String}   eventName The event type
		 * @param  {Function} fn        The reaction function
		 * @return {this}             To chain calls
		 */
		on: function( eventName, fn ){
			addListener( hub, eventName, fn );
			return this;
		},

		/**
		 * Add a reaction for an event to be executed just once
		 * @param  {String}   eventName The event type
		 * @param  {Function} fn        The reaction function
		 * @return {this}             	To chain calls
		 */
		once: function( eventName, fn ){
			var f = function f(){
				fn.apply( null, arguments );
				removeListener( hub, eventName, f );
			};

			addListener( hub, eventName, f );
			return this;
		},

		/**
		 * Removes a reaction for an event
		 * @param  {String}   eventName The event type
		 * @param  {Function} fn        The reaction function
		 * @return {this}             To chain calls
		 */
		off: function( eventName, fn ){
			removeListener( hub, eventName, fn );
			return this;
		},

		/**
		 * A mixin to be used with react components.
		 * @type {Object}
		 */
		mixin: {
			/**
			 * Triggers a DOM event in the components DOM node
			 * @param  {String} eventName The event type
			 * @param  {Mixed} detail    The detail attribute for the event, to add
			 *                           some extra data to the event.
			 * @return {Event}           The event triggered
			 */
			trigger: function( eventName, detail ){
				var el = this.getDOMNode(),
					e
				;

				if( document.createEvent ){
					e = document.createEvent( 'HTMLEvents' );
					e.initEvent( eventName, true, true );
				}
				else if( document.createEventObject ){ // IE < 9
					e = document.createEventObject();
					e.eventType = eventName;
				}

				e.detail = detail;

				if( el.dispatchEvent ){
					var result = el.dispatchEvent( e );
				}
				else if( el.fireEvent && htmlEvents[ 'on' + eventName ] ){ // IE < 9
					el.fireEvent( 'on' + eventName, e ); // can trigger only real event (e.g. 'click')
				}
				else if( el[ eventName ] ){
					el[ eventName ]();
				}
				else if( el[ 'on' + eventName ]) {
					el[ 'on' + eventName ]();
				}

				return e;
			},

			/**
			 * Returns a function that will trigger an event when called.
			 * This is great to use directly on your component's render method,
			 * so it is not needed to create a function in your component just to trigger
			 * an event.
			 * @param  {String} eventName The event type to trigger
			 * @param  {Mixed} detail    The detail attribute for the event, to add
			 *                           some extra data to the event.
			 * @return {Function}        The function that triggers an event.
			 */
			thenTrigger : function( eventName, detail ){
				return this.trigger.bind( this, eventName, detail );
			},

			/**
			 * Adds a listener for an event triggered by some child component.
			 * @param  {String}   eventName The event type
			 * @param  {Function} fn        The listener function
			 */
			listenTo: function( eventName, fn ) {
				addListener( this.getDOMNode(), eventName, fn );
			},

			/**
			 * Event listeners for events can also defined declaratively by using the
			 * component  `onEvents` attribute. That attribute must be an object with
			 * the name of the events as keys and functions or name of methods of the
			 * current component as values:
			 * 	onEvents: {
			 * 		selected: 'onSelected',
			 * 		removed: function(){
			 * 			console.log( 'removed' );
			 * 		}
			 * 	}
			 * A selected event on a children with trigger component's `onSelected` method.
			 * A removed event will trigger the function defined.
			 *
			 * Those listeners will be added in this componentDidMount method.
			 */
			componentDidMount: function(){
				if( !this.onEvents )
					return;

				var node = this.getDOMNode(),
					eventName, listener
				;

				for( eventName in this.onEvents ){
					listener = this.onEvents[ eventName ];
					if( typeof listener != 'function' )
						listener = this[listener];

					this.listenTo( eventName, listener );
				}
			}
		}
	};

	return Reactions;
}));

