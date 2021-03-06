import {Component, OnInit, ViewChild} from '@angular/core';
import {PluginClaimsHelper} from '../../../../../common/helpers';
import {SharedPnService} from '../../../shared/services';
import {InstallationCheckingPnClaims, InstallationsSortColumns, InstallationStateEnum, InstallationTypeEnum} from '../../const';
import {PageSettingsModel} from '../../../../../common/models/settings';
import {InstallationCheckingPnSettingsService, InstallationsService} from '../../services';
import {InstallationModel, InstallationsListModel, InstallationsRequestModel} from '../../models';
import {InstallationAssignComponent, InstallationNewComponent, InstallationRetractComponent} from '..';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-installations-page',
  templateUrl: './installations-page.component.html',
  styleUrls: ['./installations-page.component.scss']
})
export class InstallationsPageComponent implements OnInit {
  @ViewChild('newInstallationModal', {static: false}) newInstallationModal: InstallationNewComponent;
  @ViewChild('assignInstallationModal', {static: false}) assignInstallationModal: InstallationAssignComponent;
  @ViewChild('retractInstallationModal', {static: false}) retractInstallationModal: InstallationRetractComponent;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  installationsRequestModel: InstallationsRequestModel = new InstallationsRequestModel();
  installationsListModel: InstallationsListModel = new InstallationsListModel();
  states = [];
  installationFormId: number;
  searchSubject = new Subject();

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get installationCheckingPnClaims() {
    return InstallationCheckingPnClaims;
  }

  get installationStates() {
    return InstallationStateEnum;
  }

  get sortCols() {
    return InstallationsSortColumns;
  }

  get someAssign() {
    if (this.installationsListModel.total === 0) {
      return false;
    }
    return this.installationsListModel.installations.some(x => x.assign);
  }

  constructor(
    private sharedPnService: SharedPnService,
    private translateService: TranslateService,
    private installationsService: InstallationsService,
    private settingsService: InstallationCheckingPnSettingsService
  ) {
    this.states = [
      { id: InstallationStateEnum.NotAssigned, label: translateService.instant('Not assigned') },
      { id: InstallationStateEnum.Assigned, label: translateService.instant('Assigned') },
      { id: InstallationStateEnum.Completed, label: translateService.instant('Completed') }
    ];
    this.searchSubject.pipe(
      debounceTime(500)
    ). subscribe(val => {
      this.installationsRequestModel.searchString =  val.toString();
      this.getInstallationsList();
    });
  }

  ngOnInit() {
    this.getLocalPageSettings();

    this.settingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.installationFormId = data.model.installationFormId;
        this.getInstallationsList();
      }
    });
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService
      .getLocalPageSettings('installationCheckingPnSettings', 'Installations')
      .settings;
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      'installationCheckingPnSettings',
      this.localPageSettings,
      'Installations'
    );
    this.getInstallationsList();
  }

  getInstallationsList() {
    this.installationsRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.installationsRequestModel.sort = this.localPageSettings.sort;
    this.installationsRequestModel.pageSize = this.localPageSettings.pageSize;
    this.installationsRequestModel.type = InstallationTypeEnum.Installation;

    this.installationsService.getList(this.installationsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.installationsListModel = data.model;
      }
    });
  }

  showNewInstallationModal() {
    this.newInstallationModal.show();
  }

  showAssignInstallationModal() {
    const installationIds = this.installationsListModel.installations.filter(x => x.assign).map(x => x.id);
    this.assignInstallationModal.show(installationIds);
  }

  showRetractInstallationModal(installationModel: InstallationModel) {
    this.retractInstallationModal.show(installationModel);
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.installationsRequestModel.offset = e;
      this.getInstallationsList();
    }
  }

  onSearchInputChanged(e: any) {
    this.searchSubject.next(e.target.value);
  }

  onSelectStateChanged(e: number) {
    this.installationsRequestModel.state = e;
    this.getInstallationsList();
  }

  getSortIcon(sort: string): string {
    if (this.installationsRequestModel.sort === sort) {
      return this.installationsRequestModel.isSortDsc ? 'expand_more' : 'expand_less';
    } else {
      return 'unfold_more';
    }
  }
}
