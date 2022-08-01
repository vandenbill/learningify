import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard('jwt-rt') {
  constructor() {
    super();
  }
}
