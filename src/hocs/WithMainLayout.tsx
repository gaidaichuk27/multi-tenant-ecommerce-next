import { MainLayout } from '@layouts/MainLayout';
import { FunctionComponent, JSX } from 'react';

export const WithMainLayout = <T extends Record<string, unknown>>(
    Component: FunctionComponent<T>,
    withoutContainer?: boolean | undefined,
) => {
    return function withLayoutComponent(props: T): JSX.Element {
        return (
            <MainLayout withoutContainer={withoutContainer}>
                <Component {...props}></Component>
            </MainLayout>
        );
    };
};
