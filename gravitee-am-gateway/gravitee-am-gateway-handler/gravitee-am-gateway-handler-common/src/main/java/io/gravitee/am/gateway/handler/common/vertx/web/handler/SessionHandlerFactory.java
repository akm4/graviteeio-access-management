/**
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.gravitee.am.gateway.handler.common.vertx.web.handler;

import io.gravitee.am.gateway.handler.common.vertx.sstore.RepositorySessionStore;
import io.gravitee.am.gateway.handler.common.vertx.web.auth.provider.UserAuthProvider;
import io.gravitee.am.gateway.handler.common.vertx.web.handler.impl.SessionHandlerImpl;
import io.gravitee.am.model.Domain;
import io.gravitee.am.repository.management.api.SessionRepository;
import io.vertx.ext.web.sstore.SessionStore;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.web.handler.SessionHandler;
import io.vertx.reactivex.ext.web.sstore.LocalSessionStore;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import static io.vertx.reactivex.ext.web.handler.SessionHandler.*;


/**
 * @author Titouan COMPIEGNE (titouan.compiegne at graviteesource.com)
 * @author GraviteeSource Team
 */
public class SessionHandlerFactory implements FactoryBean<SessionHandler> {

    private static final String DEFAULT_SESSION_COOKIE_NAME = "GRAVITEE_IO_AM_SESSION";

    @Autowired
    private Environment environment;

    @Autowired
    private Vertx vertx;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @Autowired
    private Domain domain;

    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public io.vertx.reactivex.ext.web.handler.SessionHandler getObject() {
        SessionStore sessionStore = RepositorySessionStore.create(vertx, sessionRepository);
        return io.vertx.reactivex.ext.web.handler.SessionHandler.newInstance(new SessionHandlerImpl(DEFAULT_SESSION_COOKIE_NAME, DEFAULT_SESSION_COOKIE_PATH, DEFAULT_SESSION_TIMEOUT, DEFAULT_NAG_HTTPS, DEFAULT_COOKIE_SECURE_FLAG, DEFAULT_COOKIE_HTTP_ONLY_FLAG, DEFAULT_SESSIONID_MIN_LENGTH, sessionStore)
                .setCookieHttpOnlyFlag(true)
                .setSessionCookieName(environment.getProperty("http.cookie.session.name", String.class, DEFAULT_SESSION_COOKIE_NAME))
                .setSessionCookiePath("/" + domain.getPath())
                .setSessionTimeout(environment.getProperty("http.cookie.session.timeout", Long.class, DEFAULT_SESSION_TIMEOUT))
                .setCookieSecureFlag(environment.getProperty("http.cookie.secure", Boolean.class, false))
                .setAuthProvider(userAuthProvider));
    }

    @Override
    public Class<?> getObjectType() {
        return SessionHandler.class;
    }
}
