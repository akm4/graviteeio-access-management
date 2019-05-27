/*
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
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../config/app.config";
import { Observable } from "rxjs";

@Injectable()
export class ReporterService {
  private reportersURL = AppConfig.settings.baseURL + '/domains/';

  constructor(private http: HttpClient) { }

  findByDomain(domainId): Observable<any> {
    return this.http.get<any>(this.reportersURL + domainId + "/reporters");
  }

  get(domainId, id): Observable<any> {
    return this.http.get<any>(this.reportersURL + domainId + "/reporters/" + id);
  }

  update(domainId, id, reporter): Observable<any> {
    return this.http.put<any>(this.reportersURL + domainId + "/reporters/" + id, {
      'name' : reporter.name,
      'enabled': reporter.enabled,
      'configuration' : reporter.configuration
    });
  }
}
