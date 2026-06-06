import { MainLayout } from '@layouts/MainLayout';
import type { ComponentType } from 'react';

export function WithMainLayout<P extends object = object>(
    Component: ComponentType<P>,
    withContainer?: 'primary' | 'secondary' | 'tertiary' | 'fullwidth',
) {
    function WithLayoutComponent(props: P) {
        return (
            <MainLayout withContainer={withContainer ?? 'primary'}>
                <Component {...props} />
            </MainLayout>
        );
    }

    WithLayoutComponent.displayName = `WithMainLayout(${
        Component.displayName ?? Component.name ?? 'Component'
    })`;

    return WithLayoutComponent;
}
