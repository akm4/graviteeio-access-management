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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BreadcrumbService } from "../../../../../libraries/ng2-breadcrumb/components/breadcrumbService";
import { OrganizationService } from "../../../../services/organization.service";
import { CertificateService}  from "../../../../services/certificate.service";
import { SnackbarService } from "../../../../services/snackbar.service";
import { DialogService } from "../../../../services/dialog.service";

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  private domainId: string;
  configurationIsValid: boolean = true;
  configurationPristine: boolean = true;
  certificate: any;
  certificateSchema: any;
  certificateConfiguration: any;
  updateCertificateConfiguration: any;

  constructor(private route: ActivatedRoute,
              private breadcrumbService: BreadcrumbService,
              private organizationService: OrganizationService,
              private certificateService: CertificateService,
              private snackbarService: SnackbarService,
              private router: Router,
              private dialogService: DialogService) { }

  ngOnInit() {
    this.domainId = this.route.snapshot.parent.parent.params['domainId'];
    this.certificate = this.route.snapshot.data['certificate'];
    this.certificateConfiguration = JSON.parse(this.certificate.configuration);
    this.updateCertificateConfiguration = this.certificateConfiguration;
    this.organizationService.certificateSchema(this.certificate.type).subscribe(data => this.certificateSchema = data);
    this.initBreadcrumb();
  }

  update() {
    this.certificate.configuration = JSON.stringify(this.updateCertificateConfiguration);
    this.certificateService.update(this.domainId, this.certificate.id, this.certificate).subscribe(data => {
      this.breadcrumbService.addFriendlyNameForRouteRegex('/domains/'+this.domainId+'/settings/certificates/'+this.certificate.id+'$', this.certificate.name);
      this.snackbarService.open("Certificate updated");
    })
  }

  delete(event) {
    event.preventDefault();
    this.dialogService
      .confirm('Delete Certificate', 'Are you sure you want to delete this certificate ?')
      .subscribe(res => {
        if (res) {
          this.certificateService.delete(this.domainId, this.certificate.id).subscribe(() => {
            this.snackbarService.open("Certificate deleted");
            this.router.navigate(['/domains', this.domainId, 'settings', 'certificates']);
          });
        }
      });
  }

  enableCertificateUpdate(configurationWrapper) {
    window.setTimeout(() => {
      this.configurationPristine = this.certificate.configuration === JSON.stringify(configurationWrapper.configuration);
      this.configurationIsValid = configurationWrapper.isValid;
      this.updateCertificateConfiguration = configurationWrapper.configuration;
    });
  }

  initBreadcrumb() {
    this.breadcrumbService.addFriendlyNameForRouteRegex('/domains/'+this.domainId+'/settings/certificates/'+this.certificate.id+'$', this.certificate.name);
  }

}
