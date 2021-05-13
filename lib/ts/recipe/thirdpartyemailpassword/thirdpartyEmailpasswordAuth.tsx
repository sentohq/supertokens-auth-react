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
import * as React from "react";
import { PureComponent } from "react";

import ThirdPartyEmailPassword from "./thirdpartyEmailpassword";
import { FeatureBaseProps } from "../../types";
import SessionAuth from "../session/sessionAuth";
import EmailVerificationAuth from "../emailverification/emailVerificationAuth";
import SuperTokens from "../../superTokens";
import { getWindowOrThrow } from "../../utils";
import AuthRecipeModule from "../authRecipeModule";
import { isAuthRecipeModule } from "../authRecipeModule/utils";

/*
 * Component.
 */

class ThirdPartyEmailPasswordAuth<T, S, R, N> extends PureComponent<FeatureBaseProps & { requireAuth?: boolean }> {
    /*
     * Render.
     */
    render = (): JSX.Element | null => {
        return (
            <SessionAuth
                redirectToLogin={this.redirectToLogin}
                requireAuth={this.props.requireAuth === undefined || this.props.requireAuth}>
                <EmailVerificationAuth
                    recipeId={ThirdPartyEmailPassword.getInstanceOrThrow().recipeId}
                    history={this.props.history}>
                    {this.props.children}
                </EmailVerificationAuth>
            </SessionAuth>
        );
    };

    getRecipeInstanceOrThrow = (): AuthRecipeModule<T, S, R, N> => {
        if (this.props.recipeId === undefined) {
            throw new Error("No recipeId props given to ThirdPartyEmailPasswordAuth component");
        }

        const recipe = SuperTokens.getInstanceOrThrow().getRecipeOrThrow(this.props.recipeId);
        if (isAuthRecipeModule<T, S, R, N>(recipe)) {
            return recipe;
        }

        throw new Error(
            `${recipe.recipeId} must be an instance of AuthRecipeModule to use ThirdPartyEmailPasswordAuth component.`
        );
    };

    redirectToLogin = async (): Promise<void> => {
        const redirectToPath = getWindowOrThrow().location.pathname;
        await this.getRecipeInstanceOrThrow().redirect(
            { action: "SIGN_IN_AND_UP" } as unknown as T,
            this.props.history,
            {
                redirectToPath,
            }
        );
    };
}

export default function ThirdPartyAuthWrapper({
    children,
    requireAuth,
    recipeId,
}: {
    children: JSX.Element;
    requireAuth?: boolean;
    recipeId?: any;
}): JSX.Element {
    if (recipeId === undefined) {
        recipeId = ThirdPartyEmailPassword.getInstanceOrThrow().recipeId;
    }

    const reactRouterDom = SuperTokens.getInstanceOrThrow().getReactRouterDom();
    if (reactRouterDom === undefined) {
        return (
            <ThirdPartyEmailPasswordAuth requireAuth={requireAuth} recipeId={recipeId}>
                {children}
            </ThirdPartyEmailPasswordAuth>
        );
    }

    const Component = reactRouterDom.withRouter(ThirdPartyEmailPasswordAuth);
    return (
        <Component requireAuth={requireAuth} recipeId={recipeId}>
            {children}
        </Component>
    );
}
