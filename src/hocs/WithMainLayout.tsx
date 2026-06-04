import { MainLayout } from '@layouts/MainLayout';
import type { ComponentType } from 'react';

export function WithMainLayout<P extends object = object>(
    Component: ComponentType<P>,
    withoutContainer?: boolean,
) {
    function WithLayoutComponent(props: P) {
        return (
            <MainLayout withoutContainer={withoutContainer}>
                <Component {...props} />
            </MainLayout>
        );
    }

    WithLayoutComponent.displayName = `WithMainLayout(${
        Component.displayName ?? Component.name ?? 'Component'
    })`;

    return WithLayoutComponent;
}
