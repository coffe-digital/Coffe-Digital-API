import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import * as bcrypt from 'bcrypt';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { CreateClientDto } from './dto/create-client.dto';
  import { UpdateClientDto } from './dto/update-client.dto';
  import { connect } from 'http2';
  import { UserService } from 'src/user/user.service';
  
  @Injectable()
  export class ClientService {
    constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}
    
    async create(createClientDto: CreateClientDto) {
      
      const { phone, birth_date, rg, email, password, name } = createClientDto;
      
      const user = await this.userService.create({email,password,name});

      const data = {
        userId: user.id,
        phone,birth_date,rg
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
  
      return this.prisma.client.update({
        where: { id },
        data: UpdateClientDto,
      });
    }
  
    async remove(id: number) {

      const client = await this.prisma.client.findUnique({
        where: { id: id },
      });

      const userDel = await this.prisma.user.delete({where:{id:client.userId}});

      const clientDel = await this.prisma.client.delete({ where: { id } });

      return clientDel;
    }
  
  }
  