---
title: "Using react-router with redux"
type: blog
category: blog
date: 2015-08-18
slug: redux-react-router
tags: [code]

image:
  url: http://i.imgur.com/6Jqxo6Kl.jpg
  caption: Filler image! Atop Whistler Mountain near Vancouver, BC.
---

I'm working on submission and reviewer tools for FirefoxOS add-ons, which I'd
like to shout out is the most exciting thing to hit FirefoxOS yet. It'll enable
a customization community as powerful as CyanogenMod yet be much more
accessible.

For this project, I wanted to port our Flux framework from
[Flummox](http://acdlite.github.io/flummox) to
[Redux](http://rackt.github.io/redux/docs/introduction/index.html) while using
[react-router](https://github.com/rackt/react-router/). I always struggle with
getting react-router to pass Redux-related context to the handler components.
Having done this twice and running into many pitfalls, I am sharing my
experiences to prospective struggle-bus riders.

---

Note this guide will feature:

- ES6 code
- react@0.13
- react-redux@0.9.0
- react-router@1.0.0-beta1
- redux@1.0.0

If you are behind on these versions, I recommend upgrading. The Flux community
is moving very rapidly, so keep up.

### app.js

Have your Redux store created. This is explained in the Redux documentation so
I won't go into detail here. But I will note that we are using
[acdlite's](https://github.com/acdlite) ```redux-react-router``` library which
conveniently makes availalbe react-router state inside of our Redux store, and
features action creators for react-router.

    ::javascript
    import React from 'react';
    import {Provider} from 'react-redux';
    import {Route, Router} from 'react-router';
    import {history} from 'react-router/lib/BrowserHistory';
    import {combineReducers, createStore} from 'redux';
    import {reduxRouteComponent,
            routerStateReducer as router} from 'redux-react-router';

    import App from './components/App';


    const reducer = combineReducers({
      router: routerStateReducer,
      // ...other reducers.
    });
    const store = createStore(reducer);

Next, imagine that ```App``` is our root-level handler component. We're going
to need to wrap it with a Redux Provider such that it has access to the Redux
store.

Why do we need to do this? We are using ```redux-react-router``` which should
magically handle passing the Redux store as context into the handler component
for us, but unfortunately ```react@0.13``` does owner-based context which kills
this feature. ```react@0.14``` will do parent-based context so this will work
in the future without need for wrapping. Owner-based context is also why we
wrap our component in a function inside the Provider.

    ::javascript
    class ReduxApp extends React.Component {
      render() {
        return <Provider store={store}>
          {() => <App {...this.props}/>}
        </Provider>
      }
    }

Now let's build our Router and start the render:

    ::javascript
    React.render(<Router history={history}>
      <Route component={reduxRouteComponent(store)}>
        <Route name="app" path="/" component={ReduxApp}>
          // ...other routes.
        </Route>
      </Route>
    </Router>, document.querySelector('.app'));

### components/App.js

Our ```App``` component should now have access to the Redux store via context.
Although, it is usually better practice to react-redux's ```connect``` to
only expose a subset of the store. Let's see what the ```App``` component
might look like:

    ::javascript
    import {bindActionCreators} from 'redux';
    import React from 'react';
    import {connect} from 'react-redux';

    import {someApiFetch} from '../actions/someApi';


    @connect(
      state => ({user: state.user}),
      dispatch => bindActionCreators({someApiFetch}, dispatch)
    )
    export default class App extends React.Component {
      constructor(props, context) {
        super(props, context);

        if (this.props.user.loggedIn) {
          this.props.someApiFetch();
        }
      }
      render() {
        return <div>
          <p>Logged in as {this.props.user.name}!</p>
        </div>
      }
    }

But that's out of the scope of this post. You can read more about implementing
higher-level Redux components at
[react-redux](https://github.com/rackt/react-redux). Hope this routes you
in the right direction!
