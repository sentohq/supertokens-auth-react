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

import { EnterEmailProps, EnterEmailState } from "../../../types";

import FormBase from "../../library/formBase";
import { withOverride } from "../../../../../components/componentOverride/withOverride";

class EmailPasswordResetPasswordEmail extends PureComponent<EnterEmailProps, EnterEmailState> {
    static contextType = StyleContext;
    /*
     * Constructor.
     */
    constructor(props: EnterEmailProps) {
        super(props);
        this.state = {
            status: "READY",
        };
    }

    /*
     * Methods.
     */

    onSuccess = (): void => {
        this.setState(() => ({
            status: "SENT",
        }));
    };

    resend = (): void => {
        this.setState(() => ({
            status: "READY",
        }));
    };

    /*
     * Render.
     */
    render(): JSX.Element {
        const styles = this.context;
        const { formFields } = this.props;
        const { status } = this.state;

        if (status === "SENT") {
            return (
                <div data-supertokens="container" css={styles.container}>
                    <div data-supertokens="row" css={styles.row}>
                        <div
                            data-supertokens="primaryText enterEmailSuccessMessage"
                            css={[styles.primaryText, styles.enterEmailSuccessMessage]}>
                            Bitte überprüfen Sie Ihre E-mail und klicken Sie auf den Link zum zurücksetzen Ihres
                            Passworts.{" "}
                            <span data-supertokens="link" css={styles.link} onClick={this.resend}>
                                Nochmal senden
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        // Otherwise, return Form.
        return (
            <div data-supertokens="container" css={styles.container}>
                <div data-supertokens="row" css={styles.row}>
                    <FormBase
                        formFields={formFields}
                        buttonLabel={"Passwort zurücksetzen"}
                        onSuccess={this.onSuccess}
                        callAPI={async (formFields) =>
                            await this.props.recipeImplementation.sendPasswordResetEmail({
                                formFields,
                                config: this.props.config,
                            })
                        }
                        showLabels={false}
                        validateOnBlur={true}
                        header={
                            <Fragment>
                                <div data-supertokens="headerTitle" css={styles.headerTitle}>
                                    Passwort zurücksetzen
                                </div>
                                <div data-supertokens="headerSubtitle" css={styles.headerSubtitle}>
                                    <div data-supertokens="secondaryText" css={styles.secondaryText}>
                                        Wir senden Ihnen einen Link zum zurücksetzen Ihres Passworts die angegebene
                                        E-mail
                                    </div>
                                </div>
                            </Fragment>
                        }
                    />
                </div>
            </div>
        );
    }
}

export const ResetPasswordEmail = withOverride("EmailPasswordResetPasswordEmail", EmailPasswordResetPasswordEmail);
