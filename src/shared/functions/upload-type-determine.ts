import { extname } from "path";
import { UploadType } from "../enums/upload.enum";

export function getUploadType(file: Express.Multer.File): UploadType {
    const ext = extname(file.originalname).toLowerCase();

    if (['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) {
        return UploadType.IMAGE;
    } else if (['.mp3', '.wav', '.ogg', '.aac'].includes(ext)) {
        return UploadType.AUDIO;
    } else {
        throw new Error('Unsupported file type');
    }
}