// New/Updated Viewing
// ...will be new/updated for m - currently only new and created by a manager
const subscribeHook = (z, bundle) => {
  var event; 
  if (bundle.inputData.new_update === 'New') {
    event = 'viewing-add-manager';
  } else if (bundle.inputData.new_update === 'Update') {
    event = 'viewing-updated-manager';
  }
  const options = {
    url: `${process.env.BASE_URL}/webhooks/add.json`,
    method: 'POST',
    body: {
      target_url: bundle.targetUrl,
      event: event // for viewings both added AND updated AND by anyone we need a new event that has more functionality, but currently cannot do both
    }
  };
  z.console.log("New Viewing Webhook Options:", options);
  return z.request(options)
    .then(response => {
      z.console.log("New Viewing Webhook Response:", response);
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

const viewingReturn = (z, bundle) => {
  var clean = bundle.cleanedRequest;
  z.console.log("viewingReturn cleaned req", clean);
  var array = [];
  var viewing = {}; 
  viewing["ID"] = clean['data[id]'] || ""; 
  viewing["Applicants"] = clean['data[applicants]'] || ""; 
  viewing["Property Name"] = clean['data[property.name]'] || ""; 
  viewing["Property ID"] = clean['data[property.id]'] || ""; 
  viewing["Status"] = clean['data[Unit.UnitStatus.name]'] || ""; 
  viewing["Viewing Date"] = clean['data[viewing_date]'] || ""; 
  viewing["Viewing Time"] = clean['data[viewing_time]'] || ""; 
  viewing["Notes"] = clean['data[notes]'] || "";
  viewing["Offer Frequency"] = clean['data[offer_frequency]'] || ""; 
  viewing["Company"] = clean['data[company]'] || ""; 
  viewing["Archived"] = clean['data[archived]'] || ""; 
  viewing["Unit Name"] = clean['data[unit.name]'] || ""; 
  viewing["Unit ID"] = clean['data[unit.id]'] || "";
  viewing['Unit Vacant'] = clean['data[Unit.vacant]'] || "";
  viewing["Multiple Assign To Person Name"] = clean['data[multiple_assign_to_person_name]'] || ""; 
  viewing["First Name"] = clean['data[first_name]'] || ""; 
  viewing["Last Name"] = clean['data[last_name]'] || ""; 
  viewing["UK Citizen"] = clean['data[uk_citizen]'] || ""; 
  viewing["Contact Phone"] = clean['data[contact_phone]'] || ""; 
  viewing["Employment"] = clean['data[employment]'] || ""; 
  viewing["Contact Email"] = clean['data[contact_email]'] || ""; 
  viewing["Viewing"] = clean['data[viewing_source_id]'] || "";
  viewing["Event Name"] = clean['event[name]'] || "";
  z.console.log("New Viewing:", viewing);
  array.push(viewing);
  return array;
};

const viewingsList = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    method: 'GET',
    url: `${process.env.BASE_URL}/viewings/index.json`
  };
  return z.request(options)
  
  .then(response => {
    z.console.log("viewingsList Response", response);
    var content = response.json;
    var dataArray = content.data;
    var array = []; 
    // Loop through viewings
    dataArray.forEach(function(object){
      var viewing = {}; 
      viewing["ID"] = object.id || ""; 
      viewing["Applicants"] = object.applicants || ""; 
      viewing["Property Name"] = object.property.name || ""; 
      viewing["Property ID"] = object.property.id || ""; 
      viewing["Status"] = object.Unit.UnitStatus.name || ""; 
      viewing["Viewing Date"] = object.viewing_date || ""; 
      viewing["Viewing Time"] = object.viewing_time || ""; 
      viewing["Notes"] = object.notes || ""; 
      viewing["Offer Frequency"] = object.offer_frequency || ""; 
      viewing["Company"] = object.company || ""; 
      viewing["Archived"] = object.archived || ""; 
      viewing["Unit Name"] = object.unit.name || ""; 
      viewing["Unit ID"] = object.unit.id || "";
      viewing["Unit Vacant"] = object.Unit.vacant || "";
      viewing["Multiple Assign To Person Name"] = object.multiple_assign_to_person_name || ""; 
      viewing["First Name"] = object.first_name || ""; 
      viewing["Last Name"] = object.last_name || ""; 
      viewing["UK Citizen"] = object.uk_citizen || ""; 
      viewing["Contact Phone"] = object.contact_phone || ""; 
      viewing["Employment"] = object.employment; 
      viewing["Contact Email"] = object.contact_email || ""; 
      viewing["Viewing"] = object.viewing_source_id || ""; // object
      viewing["Event Name"] = "";
      array.push(viewing);
    });
    z.console.log("viewingsList Viewings Data:", dataArray);
    z.console.log("Full array of viewings:", array);
    // return the array of viewings in reverse order (since in DESC order):
    return array.reverse(); 
  });
};

// Export 
module.exports = {
  key: 'new_viewing',
  noun: 'Viewing',

  display: {
    label: 'New/Updated Viewing',
    description: 'Triggers when a new viewing is added or a viewing is updated.'
  },
  operation: {
    type: 'hook',
    perform: viewingReturn,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    performList: viewingsList, 
    inputFields: [
      {key: 'new_update', required: true, label: 'New or Updated Viewing', choices: {New: 'New', Update: 'Update'}}
    ],
    //sample: {}
  }
};
