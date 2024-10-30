import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { CommonEntity } from "./common.entity";
import { UploadEntity } from "./upload.entity";

@Entity()
export class SiteInfoEntity extends CommonEntity{
    @OneToOne(()=>UploadEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    logo: UploadEntity;

    @Column()
    siteName: string;

    @Column({ nullable: true })
    aboutUs: string;

    @Column({ nullable: true })
    contact: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;
}