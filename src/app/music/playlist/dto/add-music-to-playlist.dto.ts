import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMusicToPlaylistDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ description: 'ID of the playlist' })
    playlistId: number;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty({ description: 'ID of the music to add' })
    musicId: number;
}