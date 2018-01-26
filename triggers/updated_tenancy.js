var moment = require('moment');
// Updated Tenancy Trigger
const subscribeHook = (z, bundle) => {
  var event = 'tenancy-updated-manual';
  const options = {
    url: `${process.env.BASE_URL}/webhooks/add.json`,
    method: 'POST',
    body: {
      target_url: bundle.targetUrl,
      event: event // for updated tenancies to return also 'tenancy-updated-manual', but currently cannot do both
    }
  };
  z.console.log("Updated Tenancy Webhook Options:", options);
  return z.request(options)
    .then(response => {
      z.console.log("Updated Tenancy Webhook Response:", response);
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

const tenancyReturn = (z, bundle) => {
  var clean = bundle.cleanedRequest;
  z.console.log("tenancyReturn cleaned req", clean);
  var array = [];
  var tenancy = {};
  tenancy["ID"] = clean['data[id]'];
  tenancy["Tenancy Entity ID"] = clean['data[Tenancy.entity_id]'];
  tenancy["Tenancy Term"] = clean['data[Tenancy.tenancy_term]'];
  tenancy["Tenancy Recurring Amount"] = clean["data[Tenancy.recurring_amount]"];
  tenancy["Tenancy Start"] = clean["data[tenancy_start]"];
  tenancy["Tenancy End"] = clean["data[tenancy_end]"];
  tenancy["Tenancy Extend Date"] = clean["data[Tenancy.extend_date]"];
  tenancy["Tenancy Manager ID"] = clean["data[Tenancy.manager_person_id]"];
  tenancy["Agent Entity ID"] = clean["data[agent_entity_id]"];
  tenancy["Unit ID"] = clean['data[Unit.id]']; // duplicate
  tenancy["Unit ID"] = clean['data[unit.id]']; // duplicate
  tenancy["Unit Address"] = clean['data[unit_address]']; // duplicate
  tenancy["Unit Address"] = clean['data[Unit.Profile.address]']; // duplicate
  tenancy["Unit Address (no name)"] = clean["data[unit_address_no_name]"];
  tenancy["Status"] = clean['data[status]'];
  tenancy["Status ID"] = clean["data[status_id]"];
  tenancy["Status Alias"] = clean["data[status_alias]"];
  tenancy["Renters"] = clean["data[renters]"];
  tenancy["Renters All"] = clean["data[renters_all]"];
  tenancy["Renters Active"] = clean["data[renters_active]"];
  tenancy["Guarantor"] = clean["data[guarantor]"];
  tenancy["Rent Amount"] = clean["data[rent_amount]"];
  tenancy["Rent Amount Weekly"] = clean["data[rent_amount_weekly]"];
  tenancy["Rent Payment ID"] = clean["data[rent_payment_id]"];
  tenancy["Rent Insured"] = clean["data[rent_insured]"];
  tenancy["Rent Insured Length"] = clean["data[rent_insured_length]"];
  tenancy["Rent Grace Days"] = clean["data[rent_grace_days]"];
  tenancy["Rent Frequency"] = clean["data[rent_frequency]"];
  tenancy["Rent Frequency ID"] = clean["data[rent_frequency_id]"];
  tenancy["Rent Payment Bank Reference"] = clean["data[RentPaymentBank.reference]"];
  tenancy["Deposit Weeks"] = clean["data[deposit_weeks]"];
  tenancy["Deposit Total"] = clean["data[deposit.total]"];
  tenancy["Deposit Payment ID"] = clean["data[deposit_payment_id]"];
  tenancy["Deposit Payment Bank Reference"] = clean["data[DepositPaymentBank.reference]"];
  tenancy["Deposit Registered"] = clean["data[deposit_registered]"];
  tenancy["Deposit Registered Total Required"] = clean["data[deposit_registered_total_required]"];
  tenancy["Transactions Deposit Payment"] = clean["data[transactions_deposit_payment]"];
  tenancy["Transactions Deposit Holding Payment"] = clean["data[transactions_deposit_holding_payment]"];
  tenancy["Break Clause"] = clean["data[break_clause]"];
  tenancy["Contract Type ID"] = clean["data[contract_type_id]"];
  tenancy["Reference"] = clean["data[ref]"];
  tenancy["Reference Status"] = clean["data[reference_status]"];
  tenancy["Created"] = clean["data[created_8601]"];
  tenancy["Event Name"] = clean["event[name]"];
  array.push(tenancy);
  return array;
};

const tenanciesList = (z, bundle) => {
  const options = {
    method: 'GET',
    url: `${process.env.BASE_URL}/tenancies/index.json`
  };
  return z.request(options)
    .then(response => {
      z.console.log("tenanciesList Response", response);
      var content = response.json;
      var dataArray = content.data;
      z.console.log("Data Array:", dataArray);
      var array = [];
      // Loop through tenancies
      if (dataArray && (dataArray.message === undefined || dataArray.message === null || dataArray.message === "")) {
        dataArray.forEach(function(object) {
          var tenancy = {};
          tenancy["ID"] = object.id || "";
          tenancy["Tenancy Entity ID"] = object.Tenancy.entity_id;
          tenancy["Tenancy Term"] = object.Tenancy.tenancy_term;
          tenancy["Tenancy Recurring Amount"] = object.Tenancy.recurring_amount;
          tenancy["Tenancy Start"] = object.tenancy_start || "";
          tenancy["Tenancy End"] = object.tenancy_end || "";
          tenancy["Tenancy Extend Date"] = object.Tenancy.extend_date;
          tenancy["Tenancy Manager ID"] = object.Tenancy.manager_person_id;
          tenancy["Agent Entity ID"] = object.AgentEntity.id;
          tenancy["Unit ID"] = object.Unit.id || ""; // duplicate
          tenancy["Unit ID"] = object.unit.id; // duplicate
          tenancy["Unit Address"] = object.unit_address || ""; // duplicate
          tenancy["Unit Address"] = object.Unit.Profile.address; // duplicate
          tenancy["Unit Address (no name)"] = object.unit_address_no_name || "";
          tenancy["Status"] = object.status || "";
          tenancy["Status ID"] = object.status_id || "";
          tenancy["Status Alias"] = object.status_alias || "";
          tenancy["Renters"] = object.renters || "";
          tenancy["Renters All"] = object.renters_all || "";
          tenancy["Renters Active"] = object.renters_active || "";
          if (object.guarantor == false) {
            tenancy["Guarantor"] = 0;
          }
          else if (object.guarantor == true) {
            tenancy["Guarantor"] = 1;
          }
          else {
            tenancy["Guarantor"] = "";
          }
          tenancy["Rent Amount"] = object.rent_amount || "";
          tenancy["Rent Amount Weekly"] = object.rent_amount_weekly || "";
          tenancy["Rent Payment ID"] = object.rent_payment_id || "";
          if (object.rent_insured == false) {
            tenancy["Rent Insured"] = 0;
          }
          else if (object.rent_insured == true) {
            tenancy["Rent Insured"] = 1;
          }
          else {
            tenancy["Rent Insured"] = "";
          }
          tenancy["Rent Insured Length"] = object.rent_insured_length || "";
          tenancy["Rent Grace Days"] = object.rent_grace_days || "";
          tenancy["Rent Frequency"] = object.rent_frequency || "";
          tenancy["Rent Frequency ID"] = object.rent_frequency_id || "";
          tenancy["Rent Payment Bank Reference"] = object.RentPaymentBank.reference;
          tenancy["Deposit Weeks"] = object.deposit_weeks || "";
          tenancy["Deposit Total"] = object.deposit.total;
          tenancy["Deposit Payment ID"] = object.deposit_payment_id || "";
          tenancy["Deposit Payment Bank Reference"] = object.DepositPaymentBank.reference;
          if (object.registered_deposit == false) {
            tenancy["Deposit Registered"] = 0;
          }
          else if (object.registered_deposit == true) {
            tenancy["Deposit Registered"] = 1;
          }
          else {
            tenancy["Deposit Registered"] = "";
          }
          tenancy["Deposit Registered Total Required"] = object.deposit_registered_total_required || "";
          tenancy["Transactions Deposit Payment"] = object.transactions_deposit_payment || "";
          tenancy["Transactions Deposit Holding Payment"] = object.transactions_deposit_holding_payment || "";
          tenancy["Break Clause"] = object.break_clause || "";
          tenancy["Contract Type ID"] = object.contract_type_id || "";
          tenancy["Reference"] = object.ref || "";
          tenancy["Reference Status"] = object.reference_status || "";
          tenancy["Created"] = object.created_8601 || "";
          tenancy["Event Name"] = "Tenancy updated"; // placeholder
          array.push(tenancy);
        });
        z.console.log("tenanciesList Tenancies Data:", dataArray);
        z.console.log("Full array of tenancies:", array);
        // return the array of tenancies in reverse order (since in DESC order):
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
sampleObject["Tenancy Entity ID"] = "12345";
sampleObject["Tenancy Term"] = "";
sampleObject["Tenancy Recurring Amount"] = "100.00";
sampleObject["Tenancy Start"] = "2018-01-01";
sampleObject["Tenancy End"] = "2020-01-01";
sampleObject["Tenancy Extend Date"] = "";
sampleObject["Tenancy Manager ID"] = "";
sampleObject["Agent Entity ID"] = "12345";
sampleObject["Unit ID"] = "12345";
sampleObject["Unit Address"] = "Unit A, 123 Sample Street, Concord, California, 94519";
sampleObject["Unit Address (no name)"] = "";
sampleObject["Status"] = "Current";
sampleObject["Status ID"] = "12345";
sampleObject["Status Alias"] = "current";
sampleObject["Renters"] = "";
sampleObject["Renters All"] = "";
sampleObject["Renters Active"] = "";
sampleObject["Guarantor"] = 0;
sampleObject["Rent Amount"] = "";
sampleObject["Rent Amount Weekly"] = "";
sampleObject["Rent Payment ID"] = "";
sampleObject["Rent Insured"] = 0;
sampleObject["Rent Insured Length"] = "";
sampleObject["Rent Grace Days"] = "";
sampleObject["Rent Frequency"] = "";
sampleObject["Rent Frequency ID"] = "";
sampleObject["Rent Payment Bank Reference"] = "";
sampleObject["Deposit Weeks"] = "";
sampleObject["Deposit Total"] = "";
sampleObject["Deposit Payment ID"] = "";
sampleObject["Deposit Payment Bank Reference"] = "";
sampleObject["Deposit Registered"] = 0;
sampleObject["Deposit Registered Total Required"] = "";
sampleObject["Transactions Deposit Payment"] = "";
sampleObject["Transactions Deposit Holding Payment"] = "";
sampleObject["Break Clause"] = "";
sampleObject["Contract Type ID"] = "";
sampleObject["Reference"] = "";
sampleObject["Reference Status"] = "";
sampleObject["Created"] = "2018-01-01T16:03:34+00:00";
sampleObject["Event Name"] = "Tenancy updated"; // placeholder

// Export 
module.exports = {
  key: 'updated_tenancy',
  noun: 'Tenancy',

  display: {
    label: 'Updated Tenancy',
    description: 'Triggers when a tenancy is updated.',
    important: true
  },
  operation: {
    type: 'hook',
    perform: tenancyReturn,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    performList: tenanciesList,
    sample: sampleObject
  }
};
