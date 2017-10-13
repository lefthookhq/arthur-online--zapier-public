// create a particular test_refresh by name
const createTestrefresh = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://auth.arthuronline.co.uk/oauth/token',
    headers: { 
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded' 
    }, 
    form: { 
      refresh_token: 'e078dbd287c16624c1d1943948d7dfd97662bcddaecc7398097e75a79b825e87',
      client_id: 'c4a33cd981bb89384fbea6c316def1bb9c8ebc256fde868595babb5ef0a01a7c',
      client_secret: 'abda85c6bfb4523b04a393056ea82bf1ef7cdd31e6fef507e73d18467eb329c7',
      grant_type: 'refresh_token'
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'test_refresh',
  noun: 'Test_refresh',

  display: {
    label: 'Create Test_refresh',
    description: 'Creates a test_refresh.'
  },

  operation: {
    inputFields: [
    ],
    perform: createTestrefresh
  }
};
