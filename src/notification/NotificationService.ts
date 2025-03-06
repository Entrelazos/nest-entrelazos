import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class NotificationService {
  @OnEvent('product.statusChanged') // ✅ Listens for approval status changes
  handleProductStatusChange(product: Product) {
    console.log(
      `🚀 Product "${product.product_name}" is now ${product.approval_status}`,
    );

    // Example: Sending an email notification (integrate email service here)
    this.sendApprovalNotification(product);
  }

  private async sendApprovalNotification(product: Product) {
    // Placeholder for sending email notifications
    console.log(`📧 Sending notification for product: ${product.product_name}`);

    // Example: Send email using an email service (e.g., Nodemailer, SendGrid)
    // await this.emailService.sendProductStatusUpdateEmail(product);
  }
}
