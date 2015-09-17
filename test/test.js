var jspmServer = require('../index.js'),
    assert = require('assert'),
    http = require('http'),
    fs = require('fs'),
    webdriverio = require('webdriverio');

function writeToFile(content){
    content = "export let __hotReload = true; var elem = document.getElementById('placeholder'); elem.innerText = '"+ content +"'";
    fs.writeFile("test/jspm-project/main.js", content, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
}

describe('jspmServer', function () {
  var client = {};
  before(function (done) {
    writeToFile('Hello, world!');  
    jspmServer.start({
        open: false,
	root: 'test/jspm-project/'

    });
    client = webdriverio.remote({ desiredCapabilities: {browserName: 'firefox'} });
    client.init(done);
  });

  describe('/', function () {
          it('should return 200', function (done) {
            http.get('http://localhost:8080', function (res) {
              assert.equal(200, res.statusCode);
              done();
            });
          });
    
          it('should say "Hello, world!"', function (done) {
	      client
		  .url('http://localhost:8080')
	          .getText('h1', function(err, text){
		      assert.equal('Hello, world!', text);
	      });
	      writeToFile('Hello, john!');
	      client
		  .getText('h1', function(err, text){
	              assert.equal('Hello, john!', text);
	      }).call(done);
	  });
  });

  after(function(done) {
        client.end(done);
    });
});
