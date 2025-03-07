import { Module } from '@nestjs/common';
import { NotificationService } from './NotificationService';

@Module({
  providers: [NotificationService],
  exports: [NotificationService], // Export if needed in other modules
})
export class NotificationModule {}
