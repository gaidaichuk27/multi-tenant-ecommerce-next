import type { UserDto } from '@repo/api';

import type { User } from './types';

export function mapUserFromDto(dto: UserDto): User {
    return dto;
}
