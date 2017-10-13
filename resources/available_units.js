// get a single available_units
const getAvailableunits = (z, bundle) => {
  const responsePromise = z.request({
    url: `http://example.com/api/available_unitss/${bundle.inputData.id}.json`,
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// get a list of available_unitss
const listAvailableunitss = (z) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/available_unitss.json',
    params: {
      order_by: 'id desc'
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// find a particular available_units by name
const searchAvailableunitss = (z, bundle) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/available_unitss.json',
    params: {
      query: `name:${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// create a available_units
const createAvailableunits = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'http://example.com/api/available_unitss.json',
    body: {
      name: bundle.inputData.name // json by default
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'available_units',
  noun: 'Available_units',

  get: {
    display: {
      label: 'Get Available_units',
      description: 'Gets a available_units.'
    },
    operation: {
      inputFields: [
        {key: 'id', required: true}
      ],
      perform: getAvailableunits
    }
  },

  list: {
    display: {
      label: 'New Available_units',
      description: 'Lists the available_unitss.'
    },
    operation: {
      perform: listAvailableunitss
    }
  },

  search: {
    display: {
      label: 'Find Available_units',
      description: 'Finds a available_units by searching.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: searchAvailableunitss
    },
  },

  create: {
    display: {
      label: 'Create Available_units',
      description: 'Creates a new available_units.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: createAvailableunits
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
