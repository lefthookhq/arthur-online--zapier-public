require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);

// testing variables: 

describe('My App', () => {
  
// Authorization: 
  /*it('should authenticate', (done) => {
    var bundle = {
      authData: {
      }
    };
    appTester(App.authentication.test, bundle)
      .then(results => {
        console.log(results);
        done();
      }).catch((error) => {
        error.should.be.empty();
        done();
      })
      .catch(done);
  });*/



});
