import { getParamByName } from 'store/utils';

class Adapter {
  static get _tokenKey() {
    return 'access_token';
  }
  constructor(clientId) {
    this._redirectUrl = `${window.location.origin}/auth`;
    this._token = null;

    if (!clientId)
      throw 'Client ID is not defined';
    this._clientId = clientId;
  }

  get clientId() {
    return this._clientId;
  }
  get redirectUrl() {
    return this._redirectUrl;
  }

  auth() {
    if (!this.authUrl)
      return new Promise(reject => reject('No auth Url'));
    const params = {
      target: '_blank',
      width: 400,
      height: 400
    };
    params.left = window.screenX + window.innerWidth / 2 -
                  (params.width || 0) / 2;
    params.top = window.screenY + window.innerHeight / 2 -
                  (params.height || 0) / 2;

    const paramStr = Object.keys(params).reduce((acc, rec) => {
      acc.push(`${rec}=${params[rec]}`);
      return acc;
    }, []);

    return new Promise((resolve, reject) => {
      window.parentHandler = (href) => {
        this._token = getParamByName(Adapter._tokenKey, href);
        if (!this._token)
          reject('No received token');
        resolve();
      };
      window.open(this.authUrl, 'auth', paramStr.join(','));
    });
  }


  info() {
    return new Promise((resolve, reject) => {
      reject('Method did not implemented');
    });
  }

  friends() {
    return new Promise((resolve, reject) => {
      reject('Method did not implemented');
    });
  }
  
  events() {
    return new Promise((resolve, reject) => {
      reject('Method did not implemented');
    });
  }
}
export default Adapter;