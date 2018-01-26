const DocumentTrigger = require('./triggers/new_document');
const TasktypesResource = require('./resources/task_types');
const NewTaskTrigger = require('./triggers/new_task');
const UpdatedTaskTrigger = require('./triggers/updated_task');
const NewTenancyTrigger = require('./triggers/new_tenancy');
const UpdatedTenancyTrigger = require('./triggers/updated_tenancy');
const NewViewingTrigger = require('./triggers/new_viewing');
const UpdatedViewingTrigger = require('./triggers/updated_viewing');
const UnitAvailableTrigger = require('./triggers/unit_available');
const authentication = require('./authentication');

// To include the Authorization header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    z.console.log("Access Token", bundle.authData.access_token);
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
    request.headers['X-EntityId'] = bundle.authData.xEntityId;
    request.headers['cache-control'] = 'no-cache';
  }
  return request;
};
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication, 
  
  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    includeBearerToken
  ],

  afterResponse: [
  ],
  
  hydrators: {
    newFile: DocumentTrigger.file
  }, 

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
    [TasktypesResource.key]: TasktypesResource
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [DocumentTrigger.trigger.key]: DocumentTrigger.trigger,
    [NewTaskTrigger.key]: NewTaskTrigger,
    [UpdatedTaskTrigger.key]: UpdatedTaskTrigger,
    [UpdatedTenancyTrigger.key]: UpdatedTenancyTrigger,
    [NewTenancyTrigger.key]: NewTenancyTrigger,
    [NewViewingTrigger.key]: NewViewingTrigger,
    [UpdatedViewingTrigger.key]: UpdatedViewingTrigger,
    [UnitAvailableTrigger.key]: UnitAvailableTrigger
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
  }
};

// Finally, export the app.
module.exports = App;
