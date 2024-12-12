import { baseDriverModule } from '../core/base-driver-module';
import { EventTypes } from '../enums/EventTypes';
import { inspect } from 'util';

class Empty extends baseDriverModule {

  /**
   * Plugin initialization
   * @param resolve {Promise} - successfully complete the function with a result
   * @param reject {Promise} - exit the function with an error passed to the upper level
   */
  initDeviceEx(resolve, reject) {
    // Calling the plugin initialization constructor
    // here libraries are connected, instances of queues are created, etc.
    super.initDeviceEx(() => {
      resolve({});
    }, reject);

  }

  /**
   * Plugin connection directly to the device the plugin works with
   * (connection to the device port, device authorization, etc.)
   * @param resolve {Promise} - successfully complete the function with a result
   * @param reject {Promise} - exit the function with an error passed to the upper level
   */
  connectEx(resolve, reject) {
    super.getDevices({ currentStatus: true }).then(data => {
      this.appDevices = data;
      this.appDevices.forEach(device => {
        this.subscribeDevice(device.ident, 'changed_power');
      });
    });
    resolve({});
  }

  /**
   * External plugin command calls
   * @param command {string} - command string (e.g., get_device_custom_data)
   * @param value - data for the called command
   * @param params {Object} - plugin parameters, set in plugin settings
   * @param options {Object} - command call options
   * {
   *   "id" - driver identifier, it may have many child devices (e.g., zigbee2mqtt)
   *   "ident" - device identifier
   *   "device_id" - идентификатор дочернего устройства, для которого команда вызвана
   *   "class_name" - class name of devices
   * }
   * @param resolve {Promise} - successfully complete the function with a result
   * @param reject {Promise} - exit the function with an error passed to the upper level
   * @param status {JSON} - JSON with the current status of the device for which the command is called
   */
  commandEx(command, value, params, options, resolve, reject, status) {
    resolve({});
  }

  onSubscribeDevice(params: any) {
    const device = this.appDevices.find(item => item.ident === params.ident);
    this.app.log('onSubscribeDevice', JSON.stringify(params), !!device)
    if (device) {
      device.currentStatus = params.currentStatus;
      // this.updateDeviceCurrentStatus();
    }
  }


  /**
   * Device request for the plugin (e.g., cameras)
   * @param resolve {Promise} - successfully complete the function with a result
   * @param reject {Promise} - exit the function with an error passed to the upper level
   * @param zones {Object[]}- list of zones created in the app from the database (zones with rooms, e.g., Garage zone, with rooms inside)
   */
  getSubDevicesEx(resolve, reject, zones) {
    // Example response
    // [{
    //   class_name {string} - name of the parent class of devices
    //   identifier {string} - device identifier
    //   name {string | null} - device name
    //   zone_name {string} - device zone name
    //   params: {
    //     icon {string} - name of the SVG icon
    //     allowed names
    //         light, chandelier, rgb_lamp, rgb_strip, rgb_led, table_lamp, spotlight, sconce, facade_light,
    //         tv, gamepad, music_note, camera, security, intercom, doorlock, night,
    //         home, gates, socket, infrared, faucet, valve, hub, view_column, louvers, marquise,
    //         floor_heater, heater, heater1, convector, humidifier, ac_unit, fan, dryer, cooling, heating, anti-icing,
    //         co2, voc, p2, multisensor, temp_sensor, humidity_sensor, door_sensor, motion, leak, gas_leak, smoke,
    //         kettle, exhaust_hood, fridge, washing_machine, microwave, dish_washer, oven, stove, vacuum_cleaner
    //     identifier - device identifier
    //   }
    // }]

    resolve([]);
  }
}

process.on('uncaughtException', (err) => {
  console.error(`${err ? err.message : inspect(err)}`);
});

// Creating a plugin instance
const app = new Empty();
app.logging = true;
// For manual start/debugging of the plugin
// app.initDevice({
//   params: {
//     // port: '192.168.1.7:20108',
//     // port: '0.0.0.0:20108',
//     port: '/dev/tty.usbserial-144230',
//     baud_rate: 9600,
//     timeout: 500,
//     poll_interval: 10
//   }
// }).then(() => {
//   app.connect({id: 1}).then(() => {
//     app.subDevices({})
//   })
// })
