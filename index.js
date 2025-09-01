const connectBTN = document.querySelector(".connect");
const errorTxt = document.querySelector(".error");
const dataTxt = document.querySelector(".data");
const appUI = document.querySelector(".ui");
const connectUI = document.querySelector(".connect-ui");

let device;
let dataChar;

function handleRateChange(event) {
    console.log(event.target.value)
    dataTxt.textContent = parseHeartRate(event.target.value);
}

async function requestDevice() {
  //only works for devices advertising heart rate service
    const _options = { filters: [{ services: ["device_information"] }] };

    const options = {
        filters: [{
            namePrefix: "M"  // 只過濾名稱以 "MyDevice" 開頭的設備
        }],
        optionalServices: ["device_information"],
    };
    //device = await navigator.bluetooth.requestDevice(options);
    device = await navigator.bluetooth.getDevices();
    if (device.length === 0) {
      console.log('No Bluetooth devices found.');
      return;
    }
    device.forEach(device => {
      console.log(`Device Name: ${device.name}, Device ID: ${device.id}`);
    });
    //device.addEventListener("gattserverdisconnected", connectDevice);
}

async function connectDevice() {
    if (device.gatt.connected) return;

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("device_information");

    heartRate = await service.getCharacteristic("data_measurement");
    heartRate.addEventListener("characteristicvaluechanged", handleRateChange);
    console.log("connected");
}

async function init() {
    if (!navigator.bluetooth) return errorTxt.classList.remove("hide");
    if (!device) await requestDevice();

    connectBTN.textContent = "connecting...";
    await connectDevice();

    appUI.classList.remove("hide");
    connectUI.classList.add("hide");
    //await startMonitoring();
}



connectBTN.addEventListener("click", init);


const originalConsoleLog = console.log;
const consoleOutputDiv = document.getElementById('consoleOutput');

console.log = function(message) {
            // 呼叫原始的 console.log
    originalConsoleLog(message);

            // 在網頁上顯示
    const logMessage = document.createElement('div');
    logMessage.textContent = message;
    consoleOutputDiv.appendChild(logMessage);

            // 滾動到底部
    consoleOutputDiv.scrollTop = consoleOutputDiv.scrollHeight;
};