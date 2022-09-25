import { SetMetadata } from '@nestjs/common';

export const IS_ACTIVE_KEY = 'isActive';
export const Active = () => SetMetadata(IS_ACTIVE_KEY, true);
