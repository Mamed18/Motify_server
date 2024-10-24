import { Column, Entity, BeforeRemove } from "typeorm";
import { CommonEntity } from "./common.entity";
import { UploadType } from "src/shared/enums/upload.enum";
import { rmSync } from 'fs';
import { join } from 'path';

@Entity()
export class UploadEntity extends CommonEntity {
    @Column({ unique: true })
    url: string;

    @Column()
    type: UploadType;

    @Column()
    filename: string;

    @BeforeRemove()
    beforeRemove() {
        const filePath = join(__dirname, '..', '..', '..', 'uploads', this.filename);
        try {
            rmSync(filePath);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        }
    }
}
