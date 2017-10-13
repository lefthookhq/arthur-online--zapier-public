// get a single viewings
const getViewings = (z, bundle) => {
  const responsePromise = z.request({
    url: `http://example.com/api/viewingss/${bundle.inputData.id}.json`,
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// get a list of viewingss
const listViewingss = (z) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/viewingss.json',
    params: {
      order_by: 'id desc'
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// find a particular viewings by name
const searchViewingss = (z, bundle) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/viewingss.json',
    params: {
      query: `name:${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// create a viewings
const createViewings = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'http://example.com/api/viewingss.json',
    body: {
      name: bundle.inputData.name // json by default
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'viewings',
  noun: 'Viewings',

  get: {
    display: {
      label: 'Get Viewings',
      description: 'Gets a viewings.'
    },
    operation: {
      inputFields: [
        {key: 'id', required: true}
      ],
      perform: getViewings
    }
  },

  list: {
    display: {
      label: 'New Viewings',
      description: 'Lists the viewingss.'
    },
    operation: {
      perform: listViewingss
    }
  },

  search: {
    display: {
      label: 'Find Viewings',
      description: 'Finds a viewings by searching.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: searchViewingss
    },
  },

  create: {
    display: {
      label: 'Create Viewings',
      description: 'Creates a new viewings.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: createViewings
    },
  },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};
