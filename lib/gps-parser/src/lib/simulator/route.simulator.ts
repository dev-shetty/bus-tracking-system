import { GPSSimulator } from 'lib/gps-parser/src/lib/simulator/gps-simulator';

interface RoutePoint {
  lat: number;
  lng: number;
}

export class RouteSimulator extends GPSSimulator {
  private routePoints: RoutePoint[] = [];
  private currentPointIndex: number = 0;

  constructor(serverPort: number, deviceId: string, route: RoutePoint[]) {
    super(serverPort, deviceId);
    this.routePoints = route;
  }

  protected getNextLocation(): RoutePoint {
    const point = this.routePoints[this.currentPointIndex];
    this.currentPointIndex =
      (this.currentPointIndex + 1) % this.routePoints.length;
    return point;
  }
}

// Usage example:
const routePoints = [
  { lat: 12.9716, lng: 77.5946 }, // Start point
  { lat: 12.9726, lng: 77.5956 }, // Point 2
  { lat: 12.9736, lng: 77.5966 }, // Point 3
  // Add more points to simulate a real route
];

const routeSimulator = new RouteSimulator(8090, 'DEV001', routePoints);
