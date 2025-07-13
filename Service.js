var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Contad',
  description: 'CONTAD contract management software.',
  script: 'C:\\Users\\COMPUMARTS\\Documents\\node-pola\\sanawy_app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();