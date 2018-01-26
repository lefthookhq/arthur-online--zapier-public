// Updated Viewing
const subscribeHook = (z, bundle) => {
  var event = 'viewing-updated-manager';
  const options = {
    url: `${process.env.BASE_URL}/webhooks/add.json`,
    method: 'POST',
    body: {
      target_url: bundle.targetUrl,
      event: event // for viewings both added AND updated AND by anyone we need a new event that has more functionality, but currently cannot do both
    }
  };
  z.console.log("Updated Viewing Webhook Options:", options);
  return z.request(options)
    .then(response => {
      z.console.log("Updated Viewing Webhook Response:", response);
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
  viewing["Offer"] = clean['data[offer]'] || ""; //
  viewing["Offer Frequency"] = clean['data[offer_frequency]'] || ""; 
  //viewing["Company"] = clean['data[company]'] || ""; 
  viewing["Archived"] = clean['data[archived]'] || ""; 
  viewing["Unit Name"] = clean['data[unit.name]'] || ""; 
  viewing["Unit ID"] = clean['data[unit.id]'] || "";
  viewing["Unit Owner Name"] = clean['data[unit.owner_name]'] || ""; 
  viewing['Unit Owner ID'] = clean['data[Unit.OwnerEntity.id]'] || ""; 
  viewing['Unit Vacant'] = clean['data[Unit.vacant]'] || "";
  viewing["Multiple Assign To Person Name"] = clean['data[multiple_assign_to_person_name]'] || ""; 
  //viewing["First Name"] = clean['data[first_name]'] || ""; 
  //viewing["Last Name"] = clean['data[last_name]'] || ""; 
  viewing["UK Citizen"] = clean['data[uk_citizen]'] || ""; 
  viewing["Contact Phone"] = clean['data[contact_phone]'] || ""; 
  viewing["Contact Email"] = clean['data[contact_email]'] || ""; 
  viewing["Employment"] = clean['data[employment]'] || ""; 
  viewing["Viewing Source ID"] = clean['data[viewing_source_id]'] || "";
  viewing["Created"] = clean['data[created_8601]'] || "";
  viewing["Event Name"] = clean['event[name]'] || "";
  z.console.log("Updated Viewing:", viewing);
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
    z.console.log("Data Array:", dataArray);
    var array = []; 
    // Loop through viewings
    if(dataArray && (dataArray.message === undefined || dataArray.message === null || dataArray.message === "")) {
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
        viewing["Offer"] = object.offer || ""; 
        viewing["Offer Frequency"] = object.offer_frequency || ""; 
        //viewing["Company"] = object.company || ""; 
        if (object.archived == false) {
          viewing["Archived"] = 0; 
        } else if (object.archived == true) {
          viewing["Archived"] = 1; 
        } else {
          viewing["Archived"] = ""; 
        }
        viewing["Unit Name"] = object.unit.name || ""; 
        viewing["Unit ID"] = object.unit.id || "";
        viewing["Unit Owner Name"] = object.unit.owner_name || ""; 
        viewing["Unit Owner ID"] = object.Unit.OwnerEntity.id || "";
        viewing["Unit Vacant"] = object.Unit.vacant || "";
        viewing["Multiple Assign To Person Name"] = object.multiple_assign_to_person_name || ""; 
        //viewing["First Name"] = object.first_name || ""; 
        //viewing["Last Name"] = object.last_name || ""; 
        if (object.uk_citizen == false) {
          viewing["UK Citizen"] = 0; 
        } else if (object.uk_citizen == true) {
          viewing["UK Citizen"] = 1; 
        } else {
          viewing["UK Citizen"] = ""; 
        }
        viewing["Contact Phone"] = object.contact_phone || ""; 
        viewing["Contact Email"] = object.contact_email || ""; 
        viewing["Employment"] = object.employment; 
        viewing["Viewing Source ID"] = object.viewing_source_id || ""; 
        viewing["Created"] = object.created_8601 || ""; 
        viewing["Event Name"] = "Viewing updated by Property Manager";
        array.push(viewing);
      });
      z.console.log("viewingsList Viewings Data:", dataArray);
      z.console.log("Full array of viewings:", array);
      // return the array of viewings in reverse order (since in DESC order):
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
sampleObject["ID"] = "12345"; 
sampleObject["Applicants"] = ""; 
sampleObject["Property Name"] = "Property Name Sample"; 
sampleObject["Property ID"] = "12345"; 
sampleObject["Status"] = ""; 
sampleObject["Viewing Date"] = "2018-01-01"; 
sampleObject["Viewing Time"] = "09:00:00"; 
sampleObject["Notes"] = "Notes Sample"; 
sampleObject["Offer"] = ""; 
sampleObject["Offer Frequency"] = ""; 
//sampleObject["Company"] = ""; 
sampleObject["Archived"] = 0; 
sampleObject["Unit Name"] = "Unit Name Sample"; 
sampleObject["Unit ID"] = "12345";
sampleObject["Unit Owner Name"] = "Unit Owner Name Sample"; 
sampleObject["Unit Owner ID"] = ""; 
sampleObject["Unit Vacant"] = "";
sampleObject["Multiple Assign To Person Name"] = ""; 
//sampleObject["First Name"] = "First Name Sample"; 
//sampleObject["Last Name"] = "Last Name Sample"; 
sampleObject["UK Citizen"] = 0; 
sampleObject["Contact Phone"] = ""; 
sampleObject["Contact Email"] = "test@sample.com"; 
sampleObject["Employment"] = ""; 
sampleObject["Viewing Source ID"] = ""; 
sampleObject["Created"] = ""; 
sampleObject["Event Name"] = "Viewing updated by Property Manager";

// Export 
module.exports = {
  key: 'updated_viewing',
  noun: 'Viewing',

  display: {
    label: 'Updated Viewing',
    description: 'Triggers when a viewing is updated.', 
    important: false
  },
  operation: {
    type: 'hook',
    perform: viewingReturn,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    performList: viewingsList, 
    sample: sampleObject
  }
};