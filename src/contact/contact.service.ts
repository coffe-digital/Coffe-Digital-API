import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { CreateContactDto } from './dto/create-contact.dto';
  import { UpdateContactDto } from './dto/update-contact.dto';
  import { Contact } from './entities/contact.entity';
  import { PrismaService } from 'src/prisma/prisma.service';
  
  @Injectable()
  export class ContactService {
    constructor(private readonly prisma: PrismaService) {}
  
    async create(dto: CreateContactDto) {
      const contactExists = await this.prisma.contact.findFirst({
        where: { name: dto.name },
      });
  
      if (contactExists) {
        throw new BadRequestException('Contact already exists');
      }
  
      const data = {
        ...dto,
      };
  
      const createdContact = await this.prisma.contact.create({ data });
  
      return {
        ...createdContact,
      };
    }
  
    async findAll() {
      const contacts = await this.prisma.contact.findMany();
  
      if (!contacts || contacts.length === 0) {
        throw new NotFoundException('Contacts not found');
      }
  
      return contacts;
    }
  
    async findOne(id: number) {
      const contact = await this.prisma.contact.findUnique({
        where: { id: id },
      });
  
      if (!contact) {
        throw new NotFoundException('Contact not found');
      }
  
      return contact;
    }
  
    update(id: number, dto: UpdateContactDto) {
      return this.prisma.contact.update({
        where: { id },
        data: dto,
      });
    }
  
    remove(id: number) {
      return this.prisma.contact.delete({ where: { id } });
    }
  }
  