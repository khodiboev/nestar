import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
  getHello(): string {
    return 'Hello Nestar Batch server!';
  }

  public async batchRollback(): Promise<void> {
    console.log('Batch Rollback executed');
  }
  
  public async batchProperties(): Promise<void> {
    console.log('Batch Top Properties executed');
  }

  public async batchAgents(): Promise<void> {
    console.log('Batch Top Agents executed');
  }
}
