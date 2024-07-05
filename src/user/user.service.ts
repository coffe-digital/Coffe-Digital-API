import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import * as ExcelJS from 'exceljs';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs-extra';
import { Buffer } from 'buffer';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    if (createUserDto.roleId !== undefined) {
      const idRole = await this.prisma.role.findUnique({
        where: { id: createUserDto.roleId },
      });

      if (!idRole) {
        throw new BadRequestException('Role not exists');
      }
    }
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findByEmail(query: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: query },
    });

    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    return user;
  }

  async findAll(queryParams?: UserQueryDto): Promise<any[]> {
    let where = this.buildWhereClause(queryParams);

    const users = await this.prisma.user.findMany({
      where,
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, UpdateUserDto: UpdateUserDto) {
    if (UpdateUserDto.roleId != null) {
      const idRole = await this.prisma.role.findUnique({
        where: { id: UpdateUserDto.roleId },
      });

      if (!idRole) {
        throw new BadRequestException('Role not exists');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: UpdateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async exportToExcel(queryParams: UserQueryDto): Promise<Buffer> {
    try {
      const users = await this.findAll(queryParams);

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Users');

      // Adiciona cabeçalhos
      sheet.addRow(['ID', 'Name', 'Email', 'RoleID']);

      // Adiciona dados dos usuarios
      users.forEach(user => {
        sheet.addRow([
          user.id,
          user.name,
          user.email,
          user.roleId,
        ]);
      });

      return await workbook.xlsx.writeBuffer() as Buffer;

    } catch (error) {
      throw new Error('Failed to export to Excel');
    }
  }

  async exportToPDF(queryParams: UserQueryDto): Promise<Buffer> {
    try {
      const users = await this.findAll(queryParams);

      const doc = new PDFKit();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {});
      doc.fontSize(12);
      doc.text('List of Users', { align: 'center' });
      doc.moveDown();

      users.forEach(user => {
        doc.text(`ID: ${user.id}`);
        doc.text(`Name: ${user.name}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`RoleID: ${user.roleId}`);
        doc.moveDown();
      });

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

  private buildWhereClause(queryParams?: UserQueryDto): any {
    let where = {};

    if (queryParams) {
      const { name, email, roleId} = queryParams;

      // Aplica filtros com base nos parâmetros de consulta
      if (name || email) {
        where = {
          ...where,
          OR: [
            { name: { contains: name, mode: 'insensitive' } },
            { email: { contains: email, mode: 'insensitive' } },
          ],
        };
      }

      if (roleId !== undefined) {
        where = {
          ...where,
          roleId
        };
      }
    }

    return where;
  }
}
