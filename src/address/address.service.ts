import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto) {
    if (createAddressDto.clientId !== undefined) {
      const idClient = await this.prisma.client.findUnique({
        where: { id: createAddressDto.clientId },
      });

      if (!idClient) {
        throw new BadRequestException('Client not exists');
      }
    }
    const data = {
      ...createAddressDto,
    };

    const createdAddress = await this.prisma.address.create({ data });

    return {
      ...createdAddress,
    };
  }

  async findAll() {
    const adresses = await this.prisma.address.findMany();

    if (!adresses || adresses.length === 0) {
      throw new NotFoundException('Adresses not found');
    }

    return adresses;
  }

  async findByClient(clientId: number) {
    const adresses = await this.prisma.address.findMany({
      where: { clientId: clientId },
    });

    if (!adresses) {
      throw new NotFoundException('Adreses not found');
    }

    return adresses;
  }

  async findById(id: number) {
    const address = await this.prisma.address.findUnique({
      where: { id: id },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  remove(id: number) {
    return this.prisma.address.delete({ where: { id } });
  }
}
