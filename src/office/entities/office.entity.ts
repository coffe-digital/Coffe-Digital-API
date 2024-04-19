import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";

const { nanoid} = require('nanoid');

@Entity('offices')
export class Office{
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @BeforeInsert()
    generateId() {
        this.id = `dev_${nanoid()}`;
    }
}
