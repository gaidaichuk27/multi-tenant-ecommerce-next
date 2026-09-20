import type { GroupVisibilityDto } from '@repo/api';

export type CreateGroupFormData = {
    name: string;
    slug: string;
    description: string;
    visibility: GroupVisibilityDto;
};
