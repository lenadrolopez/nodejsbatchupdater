var request = require("request");
require("dotenv").config();
var totalRegistrers = 0;
var registers = [];
var currentInterval = -1;
var interValLength = 1;
var step = -1;
var localOffset = 0; //offset for local files
console.log(
  `Obtaining number of registers from ${process.env.URI_TOTAL_REGISTERS}`
);

request(process.env.URI_TOTAL_REGISTERS, function (error, response, body) {
  if (error === null) {
    try {
      let res = JSON.parse(body);
      totalRegistrers = parseInt(res.total);
      console.log(`Total registers ${totalRegistrers}`);
      if (typeof res.registers != "undefined") {
        registers = res.registers;
      }
      if (registers.length === 0) {
        doRegisters();
      } else {
        console.log("Process local registers");
        doLocalRegisters();
      }
    } catch (e) {
      console.error("Error obtaining registers", e);
    }
  } else {
    console.log("error", error);
  }
});

function doLocalRegisters() {
  console.log(`doLocalRegisters ${localOffset} from ${totalRegistrers}`);
  if (localOffset < totalRegistrers) {
    processRegister(JSON.stringify(registers[localOffset]));
  }
}
function processRegister(file) {
  console.log("processRegister() file", file);
  console.log(
    "processRegister() uri",
    `${process.env.URI_UPDATE_REGISTER}?register=${file}`
  );
  request(`${process.env.URI_UPDATE_REGISTER}?register=${file}`, function (
    error,
    response,
    body
  ) {
    if (error === null) {
      console.log(body);
      localOffset++;
      setTimeout(doLocalRegisters, process.env.STEP_TIME);
    } else {
      console.log("error", error);
      //reject(error);
    }
  });
}

function doRegisters() {
  //console.log('----------------------------------');
  //console.log('----------------------------------');
  //console.log('doRegisters',totalRegistrers);
  //console.log('interValLength',interValLength);
  var offset = currentInterval + 1;
  //console.log('offset',offset);
  currentInterval = currentInterval + interValLength;
  step = step + 1;
  //console.log('currentInterval',currentInterval);
  //console.log('----------------------------------');
  //console.log('----------------------------------');
  if (offset < totalRegistrers) {
    doRequest(offset, currentInterval)
      .then(function (response) {
        //console.log("\nsuccess, try next interval\n",response)
        console.log(response);
        console.log("\ncurrentInterval", currentInterval);
        console.log("\nremaing registers", totalRegistrers - currentInterval);
        setTimeout(doRegisters, process.env.STEP_TIME);
      })
      .catch(function (error) {
        console.log("error", error);
      });
  } else {
    console.log("no more registers");
  }
}

function doRequest(offset, limit) {
  return new Promise((resolve, reject) => {
    request(
      `${process.env.URI_UPDATE_REGISTER}?offset=${offset}&limit=${interValLength}&step=${step}`,
      function (error, response, body) {
        if (error === null) {
          resolve(body);
        } else {
          console.log("error", error);
          reject(error);
        }
      }
    );
  });
}
