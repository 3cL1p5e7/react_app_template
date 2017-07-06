import * as providers from './auth.providers/';

class Authentification {
  constructor(ids) {
    this._ids = ids;
    this._token = '';
    this._api = {};
    this._provider = null;
  }

  get provider() {
    return this._provider;
  }
  
  auth(type) {
    const providerClass = Object.values(providers).find(provider => provider._name === type);
    if (!providerClass)
      return new Promise(reject => reject('No such social authorizer'));
    this._provider = new providerClass(this._ids[type]);
    return this._provider.auth();
  }

  
}
const auth = new Authentification({
  vk: '*******', // number
  google: '**',
  fb: '**' // number
}); 
export default auth;
