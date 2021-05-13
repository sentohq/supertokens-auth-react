import React from "react";
export default class SessionAuth extends React.PureComponent<
    {
        requireAuth?: boolean;
        redirectToLogin?: () => Promise<void>;
    },
    | {
          status: "LOADING" | "IS_IN_NESTED_SESSION_AUTH";
      }
    | {
          status: "READY";
          userId: string;
          doesSessionExist: boolean;
          jwtPayload: any;
      }
> {
    static contextType: React.Context<import("./types").SessionContextType>;
    constructor(props: { requireAuth?: boolean; redirectToLogin?: () => Promise<void> });
    componentDidUpdate(): Promise<void>;
    handleSessionAuthContextFromParent: () => Promise<void>;
    subscribeToSessionStateChangesAndCreateContext: () => Promise<void>;
    componentDidMount(): Promise<void>;
    render: () => JSX.Element | null;
}
