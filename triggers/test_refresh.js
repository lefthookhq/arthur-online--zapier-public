// triggers on testrefresh with a certain tag
const triggerTestrefresh = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://auth.arthuronline.co.uk/oauth/token',
    headers: { 
      'postman-token': 'de8a5223-3bc2-2a0e-8bf2-cf63c767d88c',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded' 
    }, 
    form: { 
      refresh_token: '0cac935923a9f9149a3d09a861f2f802b9f535bdb2b5b816f6a6f5d339b3399e',
      client_id: '34b70bf2b5e31e59ce82a39557cb1c488cfdeaeb41f0ba2008d32ed4100f60ae',
      client_secret: 'c1ad8228f504399f0eaa6da9c3aceed9e1d37c5c0dedceaea94b5299f778656d',
      grant_type: 'refresh_token'
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'test_refresh',
  noun: 'Refresh',

  display: {
    label: 'Get Refresh',
    description: 'Triggers on a new testrefresh.', 
    hidden: true
  },

  operation: {
    inputFields: [
      
    ],
    perform: triggerTestrefresh,

    sample: {
      id: 1,
      name: 'Test'
    },

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'name', label: 'Name'}
    ]
  }
};
