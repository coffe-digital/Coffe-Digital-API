import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Repository } from 'typeorm';
import { Office } from './entities/office.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office)
    private readonly repository: Repository<Office>) {}

  create(dto: CreateOfficeDto) {
    const office = this.repository.create(dto);
    return this.repository.save(office);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateOfficeDto) {
    const office = await this.repository.findOneBy({ id });
    if (!office) return null;
    this.repository.merge(office,dto);
    return this.repository.save(office);
  }

  async remove(id: string) {
    const office = await this.repository.findOneBy({ id });
    if (!office) return null;
    return this.repository.remove(office);
  }
}
