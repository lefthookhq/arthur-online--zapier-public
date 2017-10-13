// get a list of task_typess
const listTasktypes = (z) => {
  const options = {
    method: 'GET',
    url: `${process.env.BASE_URL}/task_types/index.json`
  };
  return z.request(options)
    .then(response => {
      z.console.log("listTasktypes Response", response);
      var content = response.json;
      var dataArray = content.data;
      z.console.log("listTasktypes Tasks Data:", dataArray);
      var array = []; 
      // Loop through objects
      dataArray.forEach(function(object){
        var item = {}; 
        if (object.name) {
          item.id = object.id;
          item.name = object.name; 
          array.push(item);
        }
      });
      z.console.log("listTasktypes Tasks Data:", dataArray);
      z.console.log("New Array:", array);
      return array; 
    });
};


module.exports = {
  key: 'task_types',
  noun: 'Type',

  list: {
    display: {
      label: 'New Task Types',
      description: 'Lists the task types.', 
      hidden: true
    },
    operation: {
      perform: listTasktypes
    }
  }
};
