'use client';

import {
    ChipFilter,
    chipFilterMockItems,
} from '@features/filters/chipFilter/ui';
import { FilterDropdown } from '@features/filters/filterDropdown';
import { useMoreButton } from '@hooks/useMoreButton';
import { Button } from '@shared/ui/Form/Button';

import { cn } from '@lib/utils';

export const HomeViewFilters = () => {
    const {
        containerRef,
        contentRef,
        isExpanded,
        showMoreButton,
        toggleExpanded,
    } = useMoreButton();

    return (
        <div
            ref={containerRef}
            className="filters-row"
        >
            <div
                ref={contentRef}
                className={cn(
                    'filters-row__content',
                    isExpanded && 'filters-row__content--wrapped',
                )}
            >
                <ChipFilter
                    className="filters-row__chips"
                    fieldKey="category"
                    fields={chipFilterMockItems}
                />
                {showMoreButton && (
                    <Button
                        type="button"
                        variant="outline"
                        size="default"
                        className="filters-row__more"
                        onClick={toggleExpanded}
                    >
                        {isExpanded ? 'Show less' : 'Show more'}
                    </Button>
                )}
            </div>
            <FilterDropdown className="filters-row__dropdown" />
        </div>
    );
};
