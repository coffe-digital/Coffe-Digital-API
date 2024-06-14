import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

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

  async findAll() {
    const clients = await this.prisma.client.findMany();

    if (!clients || clients.length === 0) {
      throw new NotFoundException('Clients not found');
    }

    return clients;
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({ where: { id } });
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
}
