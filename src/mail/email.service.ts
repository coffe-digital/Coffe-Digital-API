import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(to: string) {
    try {
      const template = fs.readFileSync(
        'src/mail/template/reset-password.template.html',
        'utf8',
      );

      await this.mailerService.sendMail({
        to,
        subject: 'Coffe Digital - Password Reset Successful',
        html: template,
      });

      console.log('E-mail de redefinição de senha enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
    }
  }
}
