'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">
                        <img alt="" class="img-responsive" data-type="custom-logo" data-src="images/logo.svg">
                    </a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AccountInputComponent.html" data-type="entity-link" >AccountInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthCallbackComponent.html" data-type="entity-link" >AuthCallbackComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthPassComponent.html" data-type="entity-link" >AuthPassComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangeAvatarComponent.html" data-type="entity-link" >ChangeAvatarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatsComponent.html" data-type="entity-link" >ChatsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmAlertComponent.html" data-type="entity-link" >ConfirmAlertComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EventsComponent.html" data-type="entity-link" >EventsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExtensionInputComponent.html" data-type="entity-link" >ExtensionInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MeComponent.html" data-type="entity-link" >MeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MemoriesComponent.html" data-type="entity-link" >MemoriesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MenuComponent.html" data-type="entity-link" >MenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavComponent.html" data-type="entity-link" >NavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OopsComponent.html" data-type="entity-link" >OopsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PermissionInputComponent.html" data-type="entity-link" >PermissionInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignInComponent.html" data-type="entity-link" >SignInComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignUpComponent.html" data-type="entity-link" >SignUpComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimelinesComponent.html" data-type="entity-link" >TimelinesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadActionsComponent.html" data-type="entity-link" >UploadActionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadFileComponent.html" data-type="entity-link" >UploadFileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadInfoComponent.html" data-type="entity-link" >UploadInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadListItemComponent.html" data-type="entity-link" >UploadListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadPreviewComponent.html" data-type="entity-link" >UploadPreviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UploadsComponent.html" data-type="entity-link" >UploadsComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/ScrollNearEndDirective.html" data-type="entity-link" >ScrollNearEndDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Validation.html" data-type="entity-link" >Validation</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccountGQL.html" data-type="entity-link" >AccountGQL</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountService.html" data-type="entity-link" >AccountService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountsInfoByUsernameGQL.html" data-type="entity-link" >AccountsInfoByUsernameGQL</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link" >ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeleteUploadByIdGQL.html" data-type="entity-link" >DeleteUploadByIdGQL</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PwaService.html" data-type="entity-link" >PwaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScrollService.html" data-type="entity-link" >ScrollService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UpdateUploadByIdGQL.html" data-type="entity-link" >UpdateUploadByIdGQL</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadByIdGQL.html" data-type="entity-link" >UploadByIdGQL</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadExtensionsGQL.html" data-type="entity-link" >UploadExtensionsGQL</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadService.html" data-type="entity-link" >UploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadsGQL.html" data-type="entity-link" >UploadsGQL</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Account.html" data-type="entity-link" >Account</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AccountModel.html" data-type="entity-link" >AccountModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AccountShortModel.html" data-type="entity-link" >AccountShortModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiError.html" data-type="entity-link" >ApiError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthenticatedUser.html" data-type="entity-link" >AuthenticatedUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthModel.html" data-type="entity-link" >AuthModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmAlertOptions.html" data-type="entity-link" >ConfirmAlertOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Env.html" data-type="entity-link" >Env</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileParams.html" data-type="entity-link" >FileParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAccountModel.html" data-type="entity-link" >GetAccountModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphqlError.html" data-type="entity-link" >GraphqlError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Route.html" data-type="entity-link" >Route</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadActionsParams.html" data-type="entity-link" >UploadActionsParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadModel.html" data-type="entity-link" >UploadModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/IFrameUrlPipe.html" data-type="entity-link" >IFrameUrlPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/SexPipe.html" data-type="entity-link" >SexPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});