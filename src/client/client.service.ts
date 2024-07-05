import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { ClientQueryDto } from './dto/client-query.dto';
import * as ExcelJS from 'exceljs';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs-extra';
import { Buffer } from 'buffer';
import * as path from 'path';

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const { phone, birth_date, rg, email, password, name } = createClientDto;

    const user = await this.userService.create({ email, password, name });

    const data = {
      userId: user.id,
      phone,
      birth_date,
      rg,
    };

    const createdClient = await this.prisma.client.create({ data });

    return {
      ...createdClient,
    };
  }

  async findAll(queryParams?: ClientQueryDto): Promise<any[]> {

    if(queryParams?.name || queryParams?.email || queryParams?.roleId){
      let where = this.buildWhereClause(queryParams);
      const clients = await this.prisma.client.findMany({
      where: {
        ...where,
        user: {
          OR: [
            { name: { contains: queryParams.name, mode: 'insensitive' } },
            { email: { contains: queryParams.email, mode: 'insensitive' } },
            { roleId: queryParams.roleId },
          ],
        },
      },
      include: {
        user: true,
      },
    });
    
    if (!clients || clients.length === 0) {
      throw new NotFoundException('Clients not found');
    }

    return clients;
  }
    else {
      
      let where = this.buildWhereClause(queryParams);
      const clients = await this.prisma.client.findMany({
        where,include:{user:true}
      });

      if (!clients || clients.length === 0) {
        throw new NotFoundException('Clients not found');
      }
  
      return clients;
    }
  }

  
    
  findOne(id: number) {
    return this.prisma.client.findUnique({ where: { id },include: { user: true }, });
  }

  async update(id: number, UpdateClientDto: UpdateClientDto) {
    const clientupdate = await this.prisma.client.findUnique({ where: { id } });

    const { phone, birth_date, rg, email, password, name } = UpdateClientDto;

    const userData: UpdateUserDto = {};
    if (name || email || password) {
      userData.id = clientupdate.userId;
      if (name) userData.name = name;
      if (email) userData.email = email;
      if (password) userData.password = password;
    }

    await this.userService.update(clientupdate.userId, userData);

    const clientData: UpdateClientDto = {};
    if (phone || birth_date || rg) {
      if (phone) clientData.phone = phone;
      if (birth_date) clientData.birth_date = birth_date;
      if (rg) clientData.rg = rg;
    }

    const clientAtt = await this.prisma.client.update({
      where: { id },
      data: clientData,
      include: { user: true },
    });

    return clientAtt;
  }

  async remove(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id: id },
    });

    await this.prisma.user.delete({
      where: { id: client.userId },
    });

    const clientDel = await this.prisma.client.delete({ where: { id } });

    return clientDel;
  }

  async exportToExcel(queryParams: ClientQueryDto): Promise<Buffer> {
    try {
      const clients = await this.findAll(queryParams);

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Clients');

      // Adiciona cabeçalhos
      sheet.addRow(['ID', 'Name', 'Email', 'RoleID', 'UserID', 'Phone', 'Birth_Data', 'Rg']);

      // Adiciona dados dos usuários
      for (const client of clients) {

          sheet.addRow([
            client.id,
            client.user?.name,
            client.user?.email,
            client.user?.roleId,
            client.userId,
            client.phone,
            client.birth_date,
            client.rg,
          ]);
      }

      const buffer = await workbook.xlsx.writeBuffer();

      return buffer as Buffer;

    } catch (error) {
      console.log(error)
      throw new Error('Failed to export to Excel');
    }
  }

  
  async exportToPDF(queryParams: ClientQueryDto): Promise<Buffer> {
    try {
      const clients = await this.findAll(queryParams);

      const doc = new PDFKit();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {});
      doc.fontSize(12);
      doc.text('List of Clients', { align: 'center' });
      doc.moveDown();

      for (const client of clients) {

        doc.text(`ID: ${client.id}`);
        doc.text(`Name: ${client.user?.name}`);
        doc.text(`Email: ${client.user?.email}`);
        doc.text(`RoleID: ${client.user?.roleId}`);
        doc.text(`UserID: ${client.userId}`);
        doc.text(`Phone: ${client.phone}`);
        doc.text(`Birth_Data: ${client.birth_date}`);
        doc.text(`Rg: ${client.rg}`);
        doc.moveDown();
      }

      doc.end();

      return new Promise<Buffer>((resolve, reject) => {
        doc.on('end', () => {
          const buffer = Buffer.concat(buffers);
          resolve(buffer);
        });
        doc.on('error', reject);
      });
      
    } catch (error) {
      throw new Error('Failed to export to PDF');
    }
  }

  private buildWhereClause(queryParams?: ClientQueryDto): any {
    let where = {};

    if (queryParams) {
      const { /*name, email, roleId,*/userId, phone,birth_date,rg} = queryParams;

      // Aplica filtros com base nos parâmetros de consulta
      if (phone) {
        where = {
          ...where,
          OR: [
            { phone: { contains: phone } },
          ],
        };
      }
      
      if (birth_date) {
        where = {
          ...where,
          OR: [
            { birth_date: { contains: birth_date, mode: 'insensitive' } },
          ],
        };
      }
      
      if (rg) {
        where = {
          ...where,
          OR: [
            { rg: { contains: rg, mode: 'insensitive' } },
          ],
        };
      }
      

      if (userId !== undefined) {
        where = {
          ...where,
          userId
        };
      }
    }

    return where;
  }
  
}
