var moment = require('moment');
// Updated Task Trigger
const subscribeHook = (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/webhooks/add.json`,
    method: 'POST',
    body: {
      target_url: bundle.targetUrl,
      event: 'task-updated'
    }
  };
  z.console.log("Updated Task Webhook Options:", options);
  return z.request(options)
    .then(response => {
      z.console.log("Updated Task Webhook Response:", response);
      var content = response.json;
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Webhook was not created. Error number: " + content);
      }
      else {
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
      }
      else {
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
  task["Created"] = clean['data[created_8601]'];
  task["Alert Message"] = clean['data[alert_message]'];
  task["Event Name"] = clean['event[name]'];
  z.console.log("Updated Task:", task);
  array.push(task);
  return array;
};

const tasksList = (z, bundle) => {
  const options = {
    method: 'GET',
    url: `${process.env.BASE_URL}/tasks/index.json`
  };
  return z.request(options)

    .then(response => {
      z.console.log("tasksList Response", response);
      var content = response.json;
      var dataArray = content.data;
      z.console.log("Data Array:", dataArray);
      var array = [];
      if (dataArray && (dataArray.message === undefined || dataArray.message === null || dataArray.message === "")) {
        // Loop through tasks
        dataArray.forEach(function(object) {
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
          if (object.private == false) {
            task["Private"] = 0;
          }
          else if (object.private == true) {
            task["Private"] = 1;
          }
          else {
            task["Private"] = "";
          }
          task["Reference"] = object.ref || "";
          task["Multiple Assign to Person Name"] = object.multiple_assign_to_person_name || "";
          task["Model"] = object.model || "";
          task["Model ID"] = object.model_id || "";
          task["Description"] = object.description || "";
          task["Emergency"] = object.emergency || "";
          task["Occupant Can View"] = object.occupant_can_view || "";
          task["Date Due"] = object.date_due || "";
          task["Created"] = object.created_8601 || "";
          task["Alert Message"] = object.alert_message || "";
          task["Event Name"] = "Task updated";
          array.push(task);
        });
        z.console.log("tasksList Tasks Data:", dataArray);
        z.console.log("Full array of tasks:", array);
        // return the array of tasks in reverse order (since in DESC order):
        return array;
      } else if (dataArray && dataArray.message) {
        z.console.log("Error:", dataArray.message);
        throw new Error (`Error: ${dataArray.message}`);
      } else {
        z.console.log("Unidentified error");
        throw new Error ("Error");
      }
    });
};

var sampleObject = {};
sampleObject["ID"] = "123456";
sampleObject["Status"] = "pending";
sampleObject["Property ID"] = "12345";
sampleObject["Property Address"] = "123 Sample St.";
sampleObject["Property Address Name"] = "Property Address Name Sample";
sampleObject["Task Type"] = "";
sampleObject["Task Type ID"] = "";
sampleObject["Entity Profile Label"] = "";
sampleObject["Created By Group Name"] = "";
sampleObject["Created By Person ID"] = "";
sampleObject["Created By Person Name"] = "";
sampleObject["Created By Person Email"] = "";
sampleObject["Created By Person Phone Work"] = "";
sampleObject["Private"] = 0;
sampleObject["Reference"] = "";
sampleObject["Multiple Assign to Person Name"] = "";
sampleObject["Model"] = "";
sampleObject["Model ID"] = "";
sampleObject["Description"] = "";
sampleObject["Emergency"] = "";
sampleObject["Occupant Can View"] = "";
sampleObject["Date Due"] = "";
sampleObject["Created"] = "2018-01-01T16:03:34+00:00";
sampleObject["Alert Message"] = "";
sampleObject["Event Name"] = "Task updated";

// Export 
module.exports = {
  key: 'updated_task',
  noun: 'Task',

  display: {
    label: 'Updated Task',
    description: 'Triggers when a task is updated.',
    important: false
  },
  operation: {
    type: 'hook',
    perform: taskReturn,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    performList: tasksList,
    sample: sampleObject
  }
};
