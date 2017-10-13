// get a single tenants
const getTenants = (z, bundle) => {
  const responsePromise = z.request({
    url: `http://example.com/api/tenantss/${bundle.inputData.id}.json`,
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// get a list of tenantss
const listTenantss = (z) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/tenantss.json',
    params: {
      order_by: 'id desc'
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// find a particular tenants by name
const searchTenantss = (z, bundle) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/tenantss.json',
    params: {
      query: `name:${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// create a tenants
const createTenants = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'http://example.com/api/tenantss.json',
    body: {
      name: bundle.inputData.name // json by default
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'tenants',
  noun: 'Tenants',

  get: {
    display: {
      label: 'Get Tenants',
      description: 'Gets a tenants.'
    },
    operation: {
      inputFields: [
        {key: 'id', required: true}
      ],
      perform: getTenants
    }
  },

  list: {
    display: {
      label: 'New Tenants',
      description: 'Lists the tenantss.'
    },
    operation: {
      perform: listTenantss
    }
  },

  search: {
    display: {
      label: 'Find Tenants',
      description: 'Finds a tenants by searching.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: searchTenantss
    },
  },

  create: {
    display: {
      label: 'Create Tenants',
      description: 'Creates a new tenants.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: createTenants
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
