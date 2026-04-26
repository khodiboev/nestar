import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'node_modules/@types/ws/index.mjs';

@WebSocketGateway({transports: ['websocket'], secure: false})
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventsGateway');
  private summartClient: number = 0;

  public afterInit(sever: Server) {
    this.logger.log(`Websocket Server Initialized total: ${this.summartClient} clients`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.summartClient++;
    this.logger.log(`== Client connected, total: ${this.summartClient} clients ==`);
  }

  handleDisconnect(client: WebSocket) {
    this.summartClient--;
    this.logger.log(`== Client disconnected, total: ${this.summartClient} clients ==`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
