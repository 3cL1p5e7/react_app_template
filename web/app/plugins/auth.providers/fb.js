import axios from 'axios';
import Adapter from './adapter.js';

class Facebook extends Adapter {

  static get _name () {
    return 'fb';
  }
  static get _scopes () {
    return [
      'user_about_me',
      'email',
      'user_friends',
      'public_profile',
      'user_birthday',
      'user_events'
    ];
  }

  constructor(clientId) {
    super(clientId);
  }

  get authUrl() {
    return `https://www.facebook.com/v2.9/dialog/oauth?` +
           `response_type=token` +
           `&client_id=${this.clientId}` +
           `&redirect_uri=${this.redirectUrl}` +
           `&scope=${this.scope}`;
  }
  get infoUrl() {
    return `http://graph.facebook.com/me?` +
      `access_token=${this._token}`;
  }
  get scope() {
    return Facebook._scopes.join(',');
  }

  info() {
    return new Promise((resolve, reject) => {
      axios.get(this.infoUrl).then((resp) => {
        console.warn(resp);
        if (!resp)
          reject('No response');
        if (!resp.data)
          reject('No response data');
        this._email = resp.data.email;

        resolve(resp.data);
      }).catch(err => {
        reject(err);
      });
    });
  }
  
}

export default Facebook;
