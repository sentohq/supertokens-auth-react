/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Imports.
 */
import React from "react";
import SessionContext, { isDefaultSessionContext } from "./sessionContext";
import { getUserId, getJWTPayloadSecurely, doesSessionExist } from "./";

/*
 * Component.
 */

export default class SessionAuth extends React.PureComponent<
    {
        requireAuth?: boolean; // false by default
        redirectToLogin?: () => Promise<void>;
    },
    | { status: "LOADING" | "IS_IN_NESTED_SESSION_AUTH" }
    | {
          status: "READY";
          userId: string;
          doesSessionExist: boolean;
          jwtPayload: any;
      }
> {
    static contextType = SessionContext;
    /*
     * Constructor.
     */
    constructor(props: { requireAuth?: boolean; redirectToLogin?: () => Promise<void> }) {
        super(props);
        this.state = {
            status: "LOADING",
        };
    }

    async componentDidUpdate() {
        // TODO: check if this is called when the context / prop is updated or not..
        if (!isDefaultSessionContext(this.context)) {
            await this.handleSessionAuthContextFromParent();
        }
    }

    handleSessionAuthContextFromParent = async () => {
        // this means that we are in a nested SessionAuth wrapper
        if (this.props.requireAuth === true && !this.context.doesSessionExist) {
            if (this.props.redirectToLogin === undefined) {
                throw new Error(
                    "When using SessionAuth with requireAuth=true, please provide the redirectToLogin prop as well."
                );
            }
            return await this.props.redirectToLogin();
        }
        this.setState((oldState) => {
            if (oldState.status === "IS_IN_NESTED_SESSION_AUTH") {
                return oldState;
            }
            return {
                ...oldState,
                status: "IS_IN_NESTED_SESSION_AUTH",
            };
        });
    };

    subscribeToSessionStateChangesAndCreateContext = async () => {
        const sessionExists = await doesSessionExist();
        if (sessionExists === false) {
            if (this.props.requireAuth !== true) {
                this.setState((oldState) => {
                    return {
                        ...oldState,
                        status: "READY",
                        userId: "",
                        doesSessionExist: false,
                        jwtPayload: {},
                    };
                });
            } else {
                if (this.props.redirectToLogin === undefined) {
                    throw new Error(
                        "When using SessionAuth with requireAuth=true, please provide the redirectToLogin prop as well."
                    );
                }
                return await this.props.redirectToLogin();
            }
        } else {
            const userIdPromise = getUserId();

            const jwtPayloadPromise = getJWTPayloadSecurely();

            const userId = await userIdPromise;

            const jwtPayload = await jwtPayloadPromise;

            this.setState((oldState) => {
                return {
                    ...oldState,
                    status: "READY",
                    userId,
                    doesSessionExist: true,
                    jwtPayload,
                };
            });
        }
    };

    async componentDidMount(): Promise<void> {
        if (!isDefaultSessionContext(this.context)) {
            // since this is not the default session context, it means that
            // there is a parent SessionAuth somewhere, and that we should let them
            // handle all the context creation and management.
            await this.handleSessionAuthContextFromParent();
        } else {
            await this.subscribeToSessionStateChangesAndCreateContext();
        }
    }

    /*
     * Render.
     */
    render = (): JSX.Element | null => {
        if (this.state.status === "READY") {
            return (
                <SessionContext.Provider
                    value={{
                        userId: this.state.userId,
                        doesSessionExist: this.state.doesSessionExist,
                        jwtPayload: this.state.jwtPayload,
                    }}>
                    {this.props.children}
                </SessionContext.Provider>
            );
        } else if (this.state.status === "IS_IN_NESTED_SESSION_AUTH") {
            return <>{this.props.children}</>;
        }
        return null;
    };
}
