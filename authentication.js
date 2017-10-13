const getAccessToken = (z, bundle) => {
  z.console.log("Auth Bundle:", bundle);
  const options = {
    url: `${process.env.BASE_AUTH_URL}/oauth/token`, 
    method: 'POST',
    body: {
      grant_type: 'authorization_code',
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID, // process.env.CLIENT_ID or 'c4a33cd981bb89384fbea6c316def1bb9c8ebc256fde868595babb5ef0a01a7c'
      client_secret: process.env.CLIENT_SECRET, // process.env.CLIENT_SECRET or 'abda85c6bfb4523b04a393056ea82bf1ef7cdd31e6fef507e73d18467eb329c7'
      redirect_uri: bundle.inputData.redirect_uri,
      state: bundle.inputData.state
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  };
  // Needs to return at minimum, `access_token`, and if your app also does refresh, then `refresh_token` too
  return z.request(options)
  .then((response) => {
    z.console.log("Response Bundle:", response);
    const result = JSON.parse(response.content);
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + result.description);
    }
    z.console.log("Result Bundle:", result);
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token, 
      'X-EntityID': bundle.inputData.xEntityId
    };
  });
};

const refreshAccessToken = (z, bundle) => {
  const promise = z.request(`${process.env.BASE_AUTH_URL}/oauth/token`, {
    method: 'POST',
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });
  // Needs to return `access_token`. If the refresh token stays constant, can skip it. If it changes, can
  // return it here to update the user's auth on Zapier.
  return promise.then((response) => {
    z.console.log("Refresh Response", response);
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }

    const result = JSON.parse(response.content);
    return {
      access_token: result.access_token
    };
  });
};

const testAuth = (z /*, bundle*/) => {
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  const promise = z.request({
    url: `${process.env.BASE_URL}/tasks/index.json`,
  });
  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then((response) => {
    z.console.log("Test:", response);
    if (response.status !== 200) {
      throw new Error(JSON.parse(response.content).data.message);
    }
    return response;
  });
};

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    // Step 1 of the OAuth flow; specify where to send the user to authenticate with your API.
    // Zapier generates the state and redirect_uri, you are responsible for providing the rest.
    // Note: can also be a function that returns a string
    authorizeUrl: {
      url: `${process.env.BASE_AUTH_URL}/oauth/authorize`,
      params: {
        client_id: `${process.env.CLIENT_ID}`,
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code'
      }
    },
    // Step 2 of the OAuth flow; Exchange a code for an access token.
    // This could also use the request shorthand.
    getAccessToken: getAccessToken,
    // (Optional) If the access token expires after a pre-defined amount of time, you can implement
    // this method to tell Zapier how to refresh it.
    refreshAccessToken: refreshAccessToken,
    // If you want Zapier to automatically invoke `refreshAccessToken` on a 401 response, set to true
    autoRefresh: true
    // If there is a specific scope you want to limit your Zapier app to, you can define it here.
    // Will get passed along to the authorizeUrl
    // scope: 'read,write'
  },
  fields: [
    {label: 'Entity ID', key: 'xEntityId', type: 'string', required: true, helpText: 'In your Arthur Online account, in the footer you will see a comma-separated list of numbers. The first set of numbers is your entity id.'},
  ],
  // The test method allows Zapier to verify that the access token is valid. We'll execute this
  // method after the OAuth flow is complete to ensure everything is setup properly.
  test: testAuth
};
