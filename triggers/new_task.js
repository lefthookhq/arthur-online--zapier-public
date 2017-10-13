// New/Updated Task Trigger
// ...will be new/updated - currently only new
const subscribeHook = (z, bundle) => {
  var event; 
  if (bundle.inputData.new_update === 'New') {
    event = 'task-added';
  } else if (bundle.inputData.new_update === 'Update') {
    event = 'task-updated';
  }
  const options = {
    url: `${process.env.BASE_URL}/webhooks/add.json`,
    method: 'POST',
    body: {
      target_url: bundle.targetUrl,
      event: event // for updated tasks to return also 'task-updated', but currently cannot do both
    }
  };
  z.console.log("New Task Webhook Options:", options);
  return z.request(options)
    .then(response => {
      z.console.log("New Task Webhook Response:", response);
      var content = response.json;
      if (response.status !== 200 && response.status !== 201) {
        throw new Error ("Webhook was not created. Error number: " + content);
      } else {
        return { id: content.webhook.id };
      }
      });
};

const unsubscribeHook = (z, bundle) => {
  const hookId = bundle.subscribeData.id;
  const options = {
    url: `${process.env.BASE_URL}/webhooks/delete/${hookId}`, 
    method: 'DELETE'
  };
  return z.request(options)
    .then(response => {
      z.console.log("Unsubscribe Return", response);
      if (response.status === 200) { // currently returning a 302, getting Arthur to change to 200 (or have to add Location header)
        return {
          message: "Unsubscribe was successful."
        };
      } else {
        return {
          message: "Unsubscribe was unsuccessful"
        };
      }
    });
};

const taskReturn = (z, bundle) => {
  var clean = bundle.cleanedRequest;
  z.console.log("taskReturn cleaned req", clean);
  var array = []; 
  var task = {}; 
  task["ID"] = clean['data[id]']; 
  task["Status"] = clean['data[status]']; 
  task["Property ID"] = clean['data[property.id]']; 
  task["Property Address"] = clean['data[property_address]'];
  task["Property Address Name"] = clean['data[property.address_name]'];
  task["Task Type"] = clean['data[task_type_name]'];
  task["Task Type ID"] = clean['data[task_type_id]'];
  task["Entity Profile Label"] = clean['data[Entity.Profile.label]'];
  task["Created By Group Name"] = clean['data[created_by_group_name]'];
  task["Created By Person ID"] = clean['data[CreatedByPerson.id]'];
  task["Created By Person Name"] = clean['data[created_by_person_name]'];
  task["Created By Person Email"] = clean['data[CreatedByPerson.Profile.email]'];
  task["Created By Person Phone Work"] = clean['data[CreatedByPerson.Profile.phone_work]'];
  task["Private"] = clean['data[private]'];
  task["Reference"] = clean['data[ref]'];
  task["Multiple Assign to Person Name"] = clean['data[multiple_assign_to_person_name]'];
  task["Model"] = clean['data[model]'];
  task["Model ID"] = clean['data[model_id]'];
  task["Description"] = clean['data[description]'];
  task["Emergency"] = clean['data[emergency]'];
  task["Occupant Can View"] = clean['data[occupant_can_view]'];
  task["Date Due"] = clean['data[date_due]'];
  task["Created"] = clean['data[created]'];
  task["Alert Message"] = clean['data[alert_message]'];
  task["Event Name"] = clean['event[name]'];
  z.console.log("New Task:", task);
  array.push(task);
  return array; 
};

const tasksList = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  /*var url; 
  if (bundle.inputData.type) {
    url = `${process.env.BASE_URL}/tasks/index/filter:task_type_id:` + bundle.inputData.type  + '.json';
  } else {
    url = `${process.env.BASE_URL}/tasks/index.json`;
  }*/
  const options = {
    method: 'GET',
    url: `${process.env.BASE_URL}/tasks/index.json`
  };
  return z.request(options)
  
  .then(response => {
    z.console.log("tasksList Response", response);
    var content = response.json;
    var dataArray = content.data;
    var array = []; 
    // Loop through tasks
    dataArray.forEach(function(object){
      var task = {}; 
      task["ID"] = object.id || ""; 
      task["Status"] = object.status || ""; 
      task["Property ID"] = object.property.id || "";
      task["Property Address"] = object.property_address || "";
      task["Property Address Name"] = object.property.address_name || "";
      task["Task Type"] = object.task_type_name || ""; 
      task["Task Type ID"] = object.task_type_id || ""; 
      task["Entity Profile Label"] = object.Entity.Profile.label || ""; 
      task["Created By Group Name"] = object.created_by_group_name || "";  
      task["Created By Person ID"] = object.CreatedByPerson.id || ""; 
      task["Created By Person Name"] = object.created_by_person_name || ""; 
      task["Created By Person Email"] = object.CreatedByPerson.Profile.email || ""; 
      task["Created By Person Phone Work"] = object.CreatedByPerson.Profile.phone_work || ""; 
      task["Private"] = object.private || ""; 
      task["Reference"] = object.ref || ""; 
      task["Multiple Assign to Person Name"] = object.multiple_assign_to_person_name || ""; 
      task["Model"] = object.model || ""; 
      task["Model ID"] = object.model_id || ""; 
      task["Description"] = object.description || ""; 
      task["Emergency"] = object.emergency || ""; 
      task["Occupant Can View"] = object.occupant_can_view || ""; 
      task["Date Due"] = object.date_due || ""; 
      task["Created"] = object.created || ""; 
      task["Alert Message"] = object.alert_message || ""; 
      task["Event Name"] = ""; 
      array.push(task);
    });
    z.console.log("tasksList Tasks Data:", dataArray);
    z.console.log("Full array of tasks:", array);
    // return the array of tasks in reverse order (since in DESC order):
    return array.reverse(); 
  });
};

// Export 
module.exports = {
  key: 'new_task',
  noun: 'Task',

  display: {
    label: 'New/Updated Task', 
    description: 'Triggers when a new task is added or updated.'
  },
  operation: {
    type: 'hook',
    perform: taskReturn,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    performList: tasksList, 
    inputFields: [
      //{key: 'type', required: false, label: 'Task Type', dynamic: 'task_types.id.name', helpText: 'Enter the type of task you want returned. If empty, all new/updated tasks will be returned.'},
      {key: 'new_update', required: true, label: 'New or Updated Task', choices: {New: 'New', Update: 'Update'}}
    ],
    //sample: {}
  }
};
