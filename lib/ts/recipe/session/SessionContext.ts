import React from "react";
import { SessionContextType } from "./types";

const SessionContext = React.createContext<SessionContextType>({
    doesSessionExist: false,
    userId: "DEFAULT",
    jwtPayload: {},
});

export default SessionContext;

export function isDefaultSessionContext(context: any) {
    return !context.doesSessionExist && context.userId === "DEFAULT";
}
