import { PickType } from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";

export class LogInDto extends PickType(RegisterDto, ['userName', 'password']) {}