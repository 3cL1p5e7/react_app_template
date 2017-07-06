# auth example
Released OAuth2 to VK and Google+ (Fb in progress)

```
import auth from 'plugins/auth.js';
import Builder from 'schemes/builder';
const schemeBuilder = new Builder();

social(name) { // vk, google, fb
  return () => {
    auth.auth(name).then(() => {
      return auth.provider.info();
    }).then(res => {

      // build user by scheme (not important)
      const _user = schemeBuilder.parse('user', res, name);
      return auth.provider.friends();
    }).then(res => {
      // build friends by scheme (not important)
      const _friends = schemeBuilder
                .getAdditional('user', 'friends', res, name);
    }).catch(err => {
      console.error(err);
    });
  };
}
```

# advanced router
Custom implementation of react's redux router
```
static routeHandler() {
  return {
    routeName: '', // name of component in location
    routes: {
      '/home': (location, match, dispatch) => { // subroute
        dispatch(this.mapActions.setActive('home')); // action ? 'redux'
      }
    },
    deactivator: (dispatch) => {
      // action for deactivating all of exist subroutes
    }
  };
}
```