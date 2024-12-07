// libs/gps-parser/src/lib/simulator/gps-simulator.ts
import { EventEmitter } from 'events';
import * as net from 'net';

export class GPSSimulator {
  private socket: net.Socket;
  private interval: NodeJS.Timeout | null;

  constructor(
    private serverPort: number = 8090,
    private deviceId: string = 'DEV001',
    private startLat: number = 12.9716,
    private startLng: number = 77.5946
  ) {
    this.socket = new net.Socket();
    this.interval = null;
  }

  // TR06 Protocol packet structure
  private createPacket(): Buffer {
    const now = new Date();
    // Simulating movement by slightly changing coordinates
    this.startLat += (Math.random() - 0.5) * 0.0001;
    this.startLng += (Math.random() - 0.5) * 0.0001;

    // TR06 packet format
    const packet = Buffer.from([
      0x78,
      0x78, // start bit
      0x1f, // packet length
      0x12, // protocol number (location)
      // DateTime (6 bytes)
      now.getFullYear() - 2000, // year
      now.getMonth() + 1, // month
      now.getDate(), // day
      now.getHours(), // hour
      now.getMinutes(), // minute
      now.getSeconds(), // second
      // GPS data
      0x08, // satellites (8)
      ...this.convertCoordinate(this.startLat), // latitude
      ...this.convertCoordinate(this.startLng), // longitude
      0x25, // speed (37 km/h)
      0x00,
      0x5a, // course (90 degrees)
      0xaa, // status
      0x0d,
      0x0a, // stop bit
    ]);

    return packet;
  }

  private convertCoordinate(coord: number): number[] {
    return [
      (coord * 1800000) >> 24,
      (coord * 1800000) >> 16,
      (coord * 1800000) >> 8,
      coord * 1800000,
    ];
  }

  public start(): void {
    this.socket.connect(this.serverPort, 'localhost', () => {
      console.log('GPS Simulator connected to server');

      // Send location updates every 5 seconds
      this.interval = setInterval(() => {
        const packet = this.createPacket();
        this.socket.write(packet);
      }, 5000);
    });

    this.socket.on('error', (err) => {
      console.error('Simulator error:', err);
    });
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.socket.end();
  }
}
