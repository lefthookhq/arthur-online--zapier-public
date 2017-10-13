// get a single tasks
const getTasks = (z, bundle) => {
  const responsePromise = z.request({
    url: `http://example.com/api/taskss/${bundle.inputData.id}.json`,
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// get a list of taskss
const listTaskss = (z) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/taskss.json',
    params: {
      order_by: 'id desc'
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// find a particular tasks by name
const searchTaskss = (z, bundle) => {
  const responsePromise = z.request({
    url: 'http://example.com/api/taskss.json',
    params: {
      query: `name:${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

// create a tasks
const createTasks = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'http://example.com/api/taskss.json',
    body: {
      name: bundle.inputData.name // json by default
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'tasks',
  noun: 'Tasks',

  get: {
    display: {
      label: 'Get Tasks',
      description: 'Gets a tasks.'
    },
    operation: {
      inputFields: [
        {key: 'id', required: true}
      ],
      perform: getTasks
    }
  },

  list: {
    display: {
      label: 'New Tasks',
      description: 'Lists the taskss.'
    },
    operation: {
      perform: listTaskss
    }
  },

  search: {
    display: {
      label: 'Find Tasks',
      description: 'Finds a tasks by searching.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: searchTaskss
    },
  },

  create: {
    display: {
      label: 'Create Tasks',
      description: 'Creates a new tasks.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: createTasks
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
