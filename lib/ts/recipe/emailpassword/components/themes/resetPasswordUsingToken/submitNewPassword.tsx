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
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { PureComponent, Fragment } from "react";
import StyleContext from "../../../../../styles/styleContext";

import { SubmitNewPasswordProps, SubmitNewPasswordState } from "../../../types";
import { FormRow, Button } from "../../library";
import FormBase from "../../library/formBase";
import { withOverride } from "../../../../../components/componentOverride/withOverride";

class EmailPasswordSubmitNewPassword extends PureComponent<SubmitNewPasswordProps, SubmitNewPasswordState> {
    static contextType = StyleContext;

    /*
     * Constructor.
     */
    constructor(props: SubmitNewPasswordProps) {
        super(props);
        this.state = {
            status: "READY",
        };
    }

    onSuccess = (): void => {
        this.setState(() => ({
            status: "SUCCESS",
        }));
    };

    /*
     * Render.
     */

    render(): JSX.Element {
        const styles = this.context;
        const { formFields, onSignInClicked } = this.props;
        const { status } = this.state;

        if (status === "SUCCESS") {
            return (
                <div data-supertokens="container" css={styles.container}>
                    <div data-supertokens="row" css={styles.row}>
                        <div data-supertokens="headerTitle" css={styles.headerTitle}>
                            Passwort erfolgreich gesetzt!
                        </div>
                        <FormRow key="form-button">
                            <Fragment>
                                <div
                                    data-supertokens="primaryText submitNewPasswordSuccessMessage"
                                    css={[styles.primaryText, styles.submitNewPasswordSuccessMessage]}>
                                    Ihr Passwort wurde erfolgreich aktualisiert
                                </div>
                                <Button
                                    disabled={false}
                                    isLoading={false}
                                    type="button"
                                    onClick={onSignInClicked}
                                    label={"Anmelden"}
                                />
                            </Fragment>
                        </FormRow>
                    </div>
                </div>
            );
        }

        return (
            <div data-supertokens="container" css={styles.container}>
                <div data-supertokens="row" css={styles.row}>
                    <FormBase
                        formFields={formFields}
                        buttonLabel={"Passwort setzen"}
                        onSuccess={this.onSuccess}
                        validateOnBlur={true}
                        callAPI={async (fields) => {
                            const response = await this.props.recipeImplementation.submitNewPassword({
                                formFields: fields,
                                token: this.props.token,
                                config: this.props.config,
                            });
                            if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
                                return {
                                    status: "GENERAL_ERROR",
                                    message:
                                        "Der Link zum Setzen Ihres Passworts ist abgelaufen. Bitte klicken Sie auf \"neuen Link anfordern\" um einen neuen Link anzufordern.",
                                };
                            }
                            return response.status === "FIELD_ERROR"
                                ? response
                                : {
                                      status: "OK",
                                  };
                        }}
                        showLabels={true}
                        header={
                            <Fragment>
                                <div data-supertokens="headerTitle" css={styles.headerTitle}>
                                    Neues Passwort setzen
                                </div>
                                <div data-supertokens="headerSubtitle" css={styles.headerSubtitle}>
                                    <div data-supertokens="secondaryText" css={styles.secondaryText}>
                                        Setzen Sie hier Ihr Passwort
                                    </div>
                                </div>
                            </Fragment>
                        }
                        footer={
                            <a
                                data-supertokens="link secondaryText forgotPasswordLink"
                                css={[styles.link, styles.secondaryText, styles.forgotPasswordLink]}
                                href="/auth/reset-password">
                                Passwort erneut zurücksetzen
                            </a>
                        }
                    />
                </div>
            </div>
        );
    }
}

export const SubmitNewPassword = withOverride("EmailPasswordSubmitNewPassword", EmailPasswordSubmitNewPassword);
