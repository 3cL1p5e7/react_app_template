import * as providers from 'plugins/auth.providers/';

export const user = {
  scheme: {
    id: {
      type: 'String',
      required: true,
      hidden: true,
      map: {
        [providers.Google._name]: 'id',
        [providers.Vk._name]: 'id',
        [providers.Facebook._name]: 'id'
      }
    },
    firstname: {
      type: 'String',
      default: () => '',
      map: {
        [providers.Google._name]: 'given_name',
        [providers.Vk._name]: 'first_name',
        [providers.Facebook._name]: null
      }
    },
    lastname: {
      type: 'String',
      default: () => '',
      map: {
        [providers.Google._name]: 'family_name',
        [providers.Vk._name]: 'last_name',
        [providers.Facebook._name]: null
      }
    },
    sex: {
      type: 'Number',
      default: () => 0,
      map: {
        [providers.Google._name]: 'gender',
        [providers.Vk._name]: 'sex',
        [providers.Facebook._name]: null
      }
    },
    birthdate: {
      type: 'Date',
      default: () => null,
      map: {
        [providers.Google._name]: null,
        [providers.Vk._name]: 'bdate',
        [providers.Facebook._name]: null
      }
    },
    link: {
      type: 'String',
      default: () => '',
      map: {
        [providers.Google._name]: 'link',
        [providers.Vk._name]: null,
        [providers.Facebook._name]: null
      }
    },
    avatar: {
      type: 'String',
      default: () => null,
      map: {
        [providers.Google._name]: 'picture',
        [providers.Vk._name]: 'photo_200_orig',
        [providers.Facebook._name]: null
      }
    },
    email: {
      type: 'String',
      default: () => null,
      map: {
        [providers.Google._name]: 'email',
        [providers.Vk._name]: null,
        [providers.Facebook._name]: null
      }
    },
    friends: {
      type: '[user]', // вложенность уровня 1 необходима
      default: () => { return []; },
    },
    groups: {
      type: '[String]',
      default: () => { return []; }
    }
  }
};

export const group = {
  scheme: {
    id: {
      type: 'String',
      required: true,
      hidden: true
    },
    name: {
      type: 'String',
      default: () => ''
    },
    avatar: {
      type: 'String',
      default: () => null
    },
    subscribers: {
      type: '[String]',
      default: () => { return []; }
    }
  }
};