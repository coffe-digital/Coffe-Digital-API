import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        // secure: false,
        auth: {
          user: '06a7cdf18c87fd',
          pass: '586645fa2ea7af',
        },
      },
      defaults: {
        from: 'enzodouglaspaiva@gmail.com',
      },
    }),
  ],
})
export class EmailModule {}
