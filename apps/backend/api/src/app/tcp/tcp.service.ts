import { Injectable } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class TcpService {
  private server: net.Server;
  private connectedDevices = new Map<string, net.Socket>();

  constructor(
    private readonly deviceService,
    private readonly gpsParser
  ) {}

  async start(port = 8090) {
    this.server = net.createServer((socket) => {
      // Handle new connection
      socket.on('data', (data) => this.handleData(socket, data));
    });

    await this.server.listen(port);
  }

  private async handleData(socket: net.Socket, data: Buffer) {
    try {
      const packet = this.gpsParser.parse(data);
      await this.deviceService.processPacket(packet);
    } catch (error) {
      // Handle parsing errors
    }
  }
}
