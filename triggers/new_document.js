var request = require('request');
var mime = require('mime-types')
var _ = require('underscore');
// ...will be new/updated - currently only new
const subscribeHook = (z, bundle) => {
  const options = {
    url: `${process.env.BASE_URL}/webhooks/add.json`,
    method: 'POST',
    body: {
      target_url: bundle.targetUrl,
      event: 'asset-add'
    }
  };
  z.console.log("New Document Webhook Options:", options);
  return z.request(options)
    .then(response => {
      z.console.log("New Document Webhook Response:", response);
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

const docReturn = (z, bundle) => {
  var clean = bundle.cleanedRequest;
  return z.request({
    url: clean['data[download_url]'],
    raw: true
  }).then(response => {
    z.console.log("Response for getFile headers content disposition", response.headers['_headers']['content-disposition']);
    z.console.log("Response for getFile headers content type", response.headers['_headers']['content-type']);
    var cd = response.headers['_headers']['content-disposition'][0]; 
    var ct = response.headers['_headers']['content-type'][0]; 
    z.console.log("CT:", ct);
    var filename = cd.split("filename=")[1];
    z.console.log("Filename", filename);
    var newFile = filename.split(".")[1];
    z.console.log("Filename NEW", newFile);
    z.console.log("docReturn cleaned req", clean);
    var array = [];
    var doc = {};
    doc["ID"] = clean['data[id]'];
    doc["Name"] = clean['data[name]'];
    doc["Description"] = clean['data[description]'];
    doc["Model ID"] = clean['data[model_id]'];
    doc["Model"] = clean['data[model]'];
    doc["File Size"] = clean['data[file_size]'];
    doc["File Type"] = clean['data[file_type]'];
    doc["Mime Type"] = clean['data[Asset.mime_type]'];
    doc["Extension"] = newFile; 
    /*var ext; 
    if (clean['data[Asset.mime_type]']) {
      ext = mime.extension(clean['data[Asset.mime_type]']); 
    }
    doc["Extension"] = ext || "";*/
    doc["Asset Type ID"] = clean['data[asset_type_id]'];
    doc["Download URL"] = clean['data[download_url]'];
    if (clean['data[download_url]']) {
      doc["File"] = z.dehydrate(getFile, {
        downloadUrl: clean['data[download_url]'],
        name: clean['data[name]']
      });
    } else {
      doc["File"] = "";
    }
    // Shared with Owner (convert 0/1 to boolean): 
    if (clean['data[shared_with_owner]'] && clean['data[shared_with_owner]'] === '1') {
      doc["Shared with Owner"] = "true";
    }
    else if (clean['data[shared_with_owner]'] && clean['data[shared_with_owner]'] === '0') {
      doc["Shared with Owner"] = "false";
    }
    else {
      doc["Shared with Owner"] = clean['data[shared_with_owner]'];
    }
    // Shared with Occupant (convert 0/1 to boolean): 
    if (clean['data[shared_with_occupant]'] && clean['data[shared_with_occupant]'] === '1') {
      doc["Shared with Occupant"] = "true";
    }
    else if (clean['data[shared_with_occupant]'] && clean['data[shared_with_occupant]'] === '0') {
      doc["Shared with Occupant"] = "false";
    }
    else {
      doc["Shared with Occupant"] = clean['data[shared_with_occupant]'];
    }
    // Shared with Agent (convert 0/1 to boolean): 
    if (clean['data[shared_with_agent]'] && clean['data[shared_with_agent]'] === '1') {
      doc["Shared with Agent"] = "true";
    }
    else if (clean['data[shared_with_agent]'] && clean['data[shared_with_agent]'] === '0') {
      doc["Shared with Agent"] = "false";
    }
    else {
      doc["Shared with Agent"] = clean['data[shared_with_agent]'];
    }
    // Shared with Contractor (convert 0/1 to boolean): 
    if (clean['data[shared_with_contractor]'] && clean['data[shared_with_contractor]'] === '1') {
      doc["Shared with Contractor"] = "true";
    }
    else if (clean['data[shared_with_contractor]'] && clean['data[shared_with_contractor]'] === '0') {
      doc["Shared with Contractor"] = "false";
    }
    else {
      doc["Shared with Contractor"] = clean['data[shared_with_contractor]'];
    }
    // Shared with Manager (convert 0/1 to boolean): 
    if (clean['data[shared_with_manager]'] && clean['data[shared_with_manager]'] === '1') {
      doc["Shared with Manager"] = "true";
    }
    else if (clean['data[shared_with_manager]'] && clean['data[shared_with_manager]'] === '0') {
      doc["Shared with Manager"] = "false";
    }
    else {
      doc["Shared with Manager"] = clean['data[shared_with_manager]'];
    }
    doc["Created"] = clean['data[created]'];
    doc["Event Name"] = clean['event[name]'];
    z.console.log("New Document:", doc);
    array.push(doc);
    return array;
  });
};

const getFile = (z, bundle) => {
  /*return z.request({
    url: bundle.inputData.downloadUrl,
    raw: true
  }).then(response => {
    z.console.log("Response for getFile headers content disposition", response.headers['_headers']['content-disposition']);
    z.console.log("Response for getFile headers content type", response.headers['_headers']['content-type']);
    var cd = response.headers['_headers']['content-disposition'][0]; 
    var ct = response.headers['_headers']['content-type'][0]; 
    z.console.log("CT:", ct);
    var filename = cd.split("filename=")[1];
    z.console.log("Filename", filename);
    var newFile = filename.split(".")[1];
    z.console.log("Filename NEW", newFile);*/
  // use standard auth to request the file
  const filePromise = z.request({
    url: bundle.inputData.downloadUrl,
    raw: true
  });
  // and swap it for a stashed URL
  return z.stashFile(filePromise, undefined, bundle.inputData.name); // took out: , undefined, bundle.inputData.name, ct
  //});
};

const docList = (z, bundle) => {
  const options = {
    method: 'GET',
    url: `${process.env.BASE_URL}/assets/index.json`
  };
  let docObject;
  return z.request(options)
    .then(response => {
    var download = response.json.data[0].download_url; 
    return z.request({
      url: download,
      raw: true
    }).then(resp => {
      z.console.log("Response for getFile headers content disposition", resp.headers['_headers']['content-disposition']);
      z.console.log("Response for getFile headers content type", resp.headers['_headers']['content-type']);
      var cd = resp.headers['_headers']['content-disposition'][0]; 
      var ct = resp.headers['_headers']['content-type'][0]; 
      z.console.log("CT:", ct);
      var filename = cd.split("filename=")[1];
      z.console.log("Filename", filename);
      var newFile = filename.split(".")[1];
      z.console.log("Filename NEW", newFile);
      z.console.log("docList Response", resp);
      var content = response.json;
      var dataArray = content.data;
      var array = [];
      var ext;
      // Loop through documents
      dataArray.forEach(function(object) {
        var doc = {};
        doc["ID"] = object.id || "";
        doc["Name"] = object.name || "";
        doc["Description"] = object.description || "";
        doc["Model ID"] = object.model_id || "";
        doc["Model"] = object.model || "";
        doc["File Size"] = object.file_size || "";
        doc["File Type"] = object.file_type || "";
        doc["Mime Type"] = object.Asset.mime_type || "";
        /*if (object.Asset.mime_type) {
          ext = mime.extension(object.Asset.mime_type); 
        }
        doc["Extension"] = ext || "";*/
        doc["Extension"] = newFile || ""; 
        doc["Asset Type ID"] = object.asset_type_id || "";
        doc["Download URL"] = object.download_url || "";
        doc["File"] = z.dehydrate(getFile, {
          downloadUrl: object.download_url,
          name: object.name
        });
        // Shared with Owner (convert 0/1 to boolean): 
        if (object.shared_with_owner && object.shared_with_owner === false) {
          doc["Shared with Owner"] = "false";
        }
        else {
          doc["Shared with Owner"] = object.shared_with_owner;
        }
        // Shared with Occupant (convert 0/1 to boolean): 
        if (object.shared_with_occupant && object.shared_with_occupant === false) {
          doc["Shared with Occupant"] = "false";
        }
        else {
          doc["Shared with Occupant"] = object.shared_with_occupant;
        }
        // Shared with Agent (convert 0/1 to boolean): 
        if (object.shared_with_agent && object.shared_with_agent === false) {
          doc["Shared with Agent"] = "false";
        }
        else {
          doc["Shared with Agent"] = object.shared_with_agent;
        }
        // Shared with Contractor (convert 0/1 to boolean): 
        if (object.shared_with_contractor && object.shared_with_contractor === false) {
          doc["Shared with Contractor"] = "false";
        }
        else {
          doc["Shared with Contractor"] = object.shared_with_contractor;
        }
        // Shared with Manager (convert 0/1 to boolean): 
        if (object.shared_with_manager && object.shared_with_manager === false) {
          doc["Shared with Manager"] = "false";
        }
        else {
          doc["Shared with Manager"] = object.shared_with_manager;
        }
        doc["Created"] = object.created || "";
        doc["Event Name"] = "File uploaded";
        array.push(doc);
      });
      z.console.log("docList Document Data:", dataArray);
      z.console.log("Full array of documents:", array);
      docObject = _.first(array);
      return array;
    })/*.then(res => {
      return res.map(result => {
        // lazily convert a secret_download_url to a stashed url
        // zapier won't do this until we need it
        result.file = z.dehydrate(getFile, {
          downloadUrl: result.download_url
        });
        return result;
        //var array = []; 
        //docObject["File"] = result.file; 
        //array.push(docObject); 
        //return array;
        //delete result.download_url;
        //return result;
      });
    });.then(finalRes => {
      z.console.log("StashFile finalRes:", finalRes);
      var array = []; 
      docObject["File"] = finalRes; 
      array.push(docObject); 
      return array; 
    });*/
    });
};

module.exports = {
  trigger: {
    key: 'new_document',
    noun: 'Document',
  
    display: {
      label: 'New Document',
      description: 'Triggers on the creation of a new document.'
    },
    
    operation: {
      type: 'hook',
      perform: docReturn,
      performSubscribe: subscribeHook,
      performUnsubscribe: unsubscribeHook,
      performList: docList
      //sample: {}
    }
  }, 
  file: getFile
};
