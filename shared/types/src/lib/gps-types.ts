export interface TR06Packet {
  startBit: string; // Fixed "0x78 0x78"
  packetLength: number; // Length of packet
  protocolNumber: number; // Type of packet (0x01: Login, 0x12: Location, etc.)
  content: {
    dateTime: string; // Format: YYYY-MM-DD HH:mm:ss
    gpsInfo: {
      latitude: number; // Decimal degrees
      longitude: number; // Decimal degrees
      speed: number; // km/h
      course: number; // 0-360 degrees
      satellites: number; // Number of satellites
    };
    deviceInfo: {
      deviceId: string; // IMEI number
      batteryStatus: string;
      signalStrength: number;
      status: {
        isOilConnected: boolean;
        isGpsTracking: boolean;
        isCharging: boolean;
        isAccHigh: boolean;
        isDefenseActivated: boolean;
      };
    };
  };
  serialNumber: number;
  errorCheck: string;
  stopBit: string; // Fixed "0x0D 0x0A"
}
