import { GPSSimulator } from 'lib/gps-parser/src/lib/simulator/gps-simulator';

export class FleetSimulator {
  private simulators: GPSSimulator[] = [];

  addDevice(deviceId: string, startLat: number, startLng: number) {
    const simulator = new GPSSimulator(8090, deviceId, startLat, startLng);
    this.simulators.push(simulator);
    simulator.start();
  }

  startAll() {
    this.simulators.forEach((sim) => sim.start());
  }

  stopAll() {
    this.simulators.forEach((sim) => sim.stop());
  }
}

// Usage:
const fleet = new FleetSimulator();
fleet.addDevice('BUS001', 12.9716, 77.5946);
fleet.addDevice('BUS002', 12.9726, 77.5956);
fleet.startAll();
