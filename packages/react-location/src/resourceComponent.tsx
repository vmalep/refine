/* eslint-disable react/display-name */
import React from "react";
import {
    ErrorComponent,
    LayoutWrapper,
    useResource,
    useRefineContext,
    useRouterContext,
    ResourceRouterParams,
    CanAccess,
} from "@pankod/refine-core";

export const ResourceComponentWrapper: React.FC = () => {
    const { catchAll } = useRefineContext();
    const { useParams } = useRouterContext();
    const { resources } = useResource();

    const {
        resource: routeResourceName,
        action,
        id: idFromRoute,
    } = useParams<ResourceRouterParams>();

    const id = idFromRoute ? decodeURIComponent(idFromRoute) : undefined;

    const resource = resources.find((res) => res.route === routeResourceName);

    if (resource) {
        const {
            list,
            create,
            edit,
            show,
            name,
            canCreate,
            canEdit,
            canShow,
            canDelete,
        } = resource;

        const List = list ?? (() => null);
        const Create = create ?? (() => null);
        const Edit = edit ?? (() => null);
        const Show = show ?? (() => null);

        const renderCrud = () => {
            switch (action) {
                case undefined:
                    return (
                        <CanAccess
                            resource={name}
                            action="list"
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <List
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                            />
                        </CanAccess>
                    );

                case "create":
                case "clone":
                    return (
                        <CanAccess
                            resource={name}
                            action="create"
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <Create
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                            />
                        </CanAccess>
                    );

                case "edit":
                    return (
                        <CanAccess
                            resource={name}
                            action="edit"
                            params={{ id }}
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <Edit
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                            />
                        </CanAccess>
                    );

                case "show":
                    return (
                        <CanAccess
                            resource={name}
                            action="show"
                            params={{ id }}
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <Show
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                            />
                        </CanAccess>
                    );
            }
        };

        return <LayoutWrapper>{renderCrud()}</LayoutWrapper>;
    }

    return catchAll ? (
        <>{catchAll}</>
    ) : (
        <LayoutWrapper>
            <ErrorComponent />
        </LayoutWrapper>
    );
};
