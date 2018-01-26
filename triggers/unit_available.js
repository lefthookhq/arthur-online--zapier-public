var moment = require('moment');
// Unit Becomes Available to Let
const subscribeHook = (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/webhooks/add.json`,
    method: 'POST',
    body: {
      target_url: bundle.targetUrl,
      event: 'unit-available'
    }
  };
  z.console.log("Unit Available Webhook Options:", options);
  return z.request(options)
    .then(response => {
      z.console.log("Unit Available Webhook Response:", response);
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

const unitReturn = (z, bundle) => {
  var array = [];
  var clean = bundle.cleanedRequest;
  z.console.log("unitReturn cleaned req", clean);
  var unit = {};
  unit["ID"] = clean['data[id]'];
  unit["Name"] = clean['data[name]'];
  unit["Status"] = clean['data[status]'];
  unit["Status Alias"] = clean['data[status_alias]'];
  unit["Address"] = clean['data[address]'];
  unit["Address Line 1"] = clean['data[address1]'];
  unit["Address Line 2"] = clean['data[address2]'];
  unit["City"] = clean['data[city]'];
  unit["County"] = clean['data[county]'];
  unit["Country"] = clean['data[country]'];
  unit["Postal Code"] = clean['data[postcode]'];
  unit["Agent"] = {};
  unit["Created"] = clean['data[created_8601]'];
  unit["Vacant"] = clean['data[vacant]'];
  unit["Days Vacant"] = clean['data[days_vacant]'];
  unit["Days Vacant Total"] = clean['data[days_vacant_total]'];
  unit["Viewing Count"] = clean['data[viewing_count]'];
  unit["Refurb"] = clean['data[refurb]'];
  unit["Rent Amount"] = clean['data[rent_amount]'];
  unit["Manager ID"] = clean['data[manager.id]'];
  unit["Manager Name"] = clean['data[manager.name]'];
  unit["Property ID"] = clean['data[property.id]'];
  unit["Property Name"] = clean['data[property.name]'];
  unit["Event Name"] = clean['event[name]'];
  z.console.log("New Unit:", unit);
  array.push(unit);
  return array;
};

const unitsList = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    method: 'GET',
    url: `${process.env.BASE_URL}/units/index.json`
  };
  return z.request(options)
    .then(response => {
      z.console.log("unitsList Response", response);
      var content = response.json;
      var dataArray = content.data;
      z.console.log("Data Array:", dataArray);
      var array = [];
      if (dataArray && (dataArray.message === undefined || dataArray.message === null || dataArray.message === "")) {
        // Loop through units
        dataArray.forEach(function(object) {
          if (object.status === "Available To Let") {
            var unit = {};
            unit["ID"] = object.id || "";
            unit["Name"] = object.name || "";
            unit["Status"] = object.status || "";
            unit["Status Alias"] = object.status_alias || "";
            unit["Address"] = object.address || "";
            unit["Address Line 1"] = object.address1 || "";
            unit["Address Line 2"] = object.address2 || "";
            unit["City"] = object.city || "";
            unit["County"] = object.county || "";
            unit["Country"] = object.country || "";
            unit["Postal Code"] = object.postcode || "";
            unit["Created"] = object.created_8601 || "";
            unit["Vacant"] = object.vacant || "";
            unit["Days Vacant"] = object.days_vacant || "";
            unit["Days Vacant Total"] = object.days_vacant_total || "";
            unit["Viewing Count"] = object.viewing_count || "";
            if (object.refurb == false) {
              unit["Refurb"] = 0;
            }
            else if (object.refurb == true) {
              unit["Refurb"] = 1;
            }
            else {
              unit["Refurb"] = "";
            }
            unit["Rent Amount"] = object.rent_amount || "";
            unit["Manager ID"] = object.manager.id || "";
            unit["Manager Name"] = object.manager.name || "";
            unit["Property ID"] = object.property.id || "";
            unit["Property Name"] = object.property.name || "";
            unit["Event Name"] = "Unit added";
            array.push(unit);
          }
        });
        z.console.log("unitsList Units Data:", dataArray);
        z.console.log("Full array of 'Available to Let':", array);
        // return the array of "Available to Let" units in reverse order (since in DESC order):
        return array.reverse();
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
sampleObject["Name"] = "Unit Name Sample";
sampleObject["Status"] = "";
sampleObject["Status Alias"] = "";
sampleObject["Address"] = "123 Sample St.";
sampleObject["Address Line 1"] = "123 Sample St.";
sampleObject["Address Line 2"] = "Unit A";
sampleObject["City"] = "Concord";
sampleObject["County"] = "Contra Costa";
sampleObject["Country"] = "US";
sampleObject["Postal Code"] = "94519";
sampleObject["Created"] = "2017-10-25T16:03:34+00:00";
sampleObject["Vacant"] = "";
sampleObject["Days Vacant"] = "";
sampleObject["Days Vacant Total"] = "";
sampleObject["Viewing Count"] = "";
sampleObject["Refurb"] = 0;
sampleObject["Rent Amount"] = "100.00";
sampleObject["Manager ID"] = "12345";
sampleObject["Manager Name"] = "Manager Name Sample";
sampleObject["Property ID"] = "12345";
sampleObject["Property Name"] = "Property Name Sample";
sampleObject["Event Name"] = "Unit added";

// Export 
module.exports = {
  key: 'unit_available',
  noun: 'Unit',

  display: {
    label: 'Unit Becomes Available to Let',
    description: 'Triggers when a unit becomes available to let.',
    important: true
  },
  operation: {
    type: 'hook',
    perform: unitReturn,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    performList: unitsList,
    sample: sampleObject
  }
};
