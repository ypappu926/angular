import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/CommoUtils/common-services/common.service';
import { TnService } from 'src/app/services/tn.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss'],
})
export class AgGridComponent implements OnInit {
  tempParam;
  gridApi;
  gridColumnApi;
  columnDefs: any; // ColDef[];
  gridOptions;
  rowSelection;
  rowGroupPanelShow;
  serverSideStoreType;
  pagination;
  paginationPageSize;
  pivotPanelShow;
  groupDisplayType;
  statusBar;
  defaultColDef;
  rowModelType;
  sideBar;
  getServerSideStoreParams;
  autoGroupColumnDef;

  rowData: any = [];
  fromDate;
  toDate;
  searchValue: any;

  constructor(
    private tnService: TnService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.hideWatermark();
    this.resetFilter(true);
    // this.fetchBankList();
    this.setOptionsSetting();
  }

  hideWatermark() {
    if (!$('.ag-watermark').hasClass('ag-hidden')) {
      $('.ag-watermark').addClass('ag-hidden');
      setTimeout(() => {
        this.hideWatermark();
      }, 10);
    }
  }

  onGridReady(params) {
    this.tempParam = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const filterJSON = {
      fromDate: this.fromDate ? this.getFormatedDate(this.fromDate) : undefined,
      toDate: this.toDate ? this.getFormatedDate(this.toDate) : undefined,
      // selectedScheme: this.schemeId !== -1 ? this.schemeId.toString() : !_.isEmpty(this.selectedScheme) ? this.selectedScheme.toString() : undefined,
      // selectedStage: !_.isEmpty(this.selectedStage) ? (this.selectedStage.sort()).toString() : undefined,
      // selectedProposalDetails: !_.isEmpty(this.selectedProposalDetails) ? this.selectedProposalDetails.toString() : undefined,
      // selectedProposalStatus: !_.isEmpty(this.selectedProposalStatus) ? this.selectedProposalStatus.toString() : undefined,
      // selectedOrg: !this.isAllBankFlag ? (!_.isEmpty(this.selectedOrg) ? this.selectedOrg.toString() : undefined) : undefined,
      // selectedCampaignType: this.selectedCampaignType ? this.selectedCampaignType : undefined,
    };
    this.tnService.spGetAgGridData(filterJSON).subscribe((response) => {
      this.rowData = [];
      if (response && response.data) {
        this.rowData = response.data;
        this.columnDefs = JSON.parse(response.data[0].columnName);
        var fakeServer = this.createFakeServer(this.rowData);
        var datasource = this.createServerSideDatasource(fakeServer);
        params.api.setServerSideDatasource(datasource);
        setTimeout(() => {
          this.autoSizeAll(false);
        }, 0);
      }
    });
  }

  createFakeServer(allData) {
    return {
      getData: function (request) {
        var requestedRows = allData.slice();
        return {
          success: true,
          rows: requestedRows,
        };
      },
    };
  }

  createServerSideDatasource(server) {
    return {
      getRows: function (params) {
        // console.log('[Datasource] - rows requested by grid: ', params.request);
        var response = server.getData(params.request);
        setTimeout(function () {
          if (response.success) {
            params.success({ rowData: response.rows });
          } else {
            params.fail();
          }
        }, 500);
      },
    };
  }

  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  getFormatedDate(date): any {
    const dateParts = date.split('-');
    const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return this.datePipe.transform(dateObj, 'y-MM-dd');
  }

  resetFilter(isOnLoad?) {
    // const date1 = new Date(new Date);
    // this.maxDate = { year: date1.getFullYear(), month: date1.getMonth() + 1, day: date1.getDate() };
    // const date = { year: date1.getFullYear(), month: date1.getMonth() + 1, day: date1.getDate() };
    // // this.fromDate = ((date.day === 1 ? 1 : date.day - 1) + '-' + date.month + '-' + date.year);
    // this.fromDate = (date.day + '-' + date.month + '-' + date.year);
    // const date2 = new Date(this.fromDate);
    // this.minDate = { year: date2.getFullYear(), month: date2.getMonth() + 1, day: date2.getDate() };
    // this.toDate = (date.day + '-' + date.month + '-' + date.year);
    // this.fromDate = undefined;
    // this.toDate = undefined;
    // this.isCollapsed = false;
    // this.selectedScheme = [];
    // this.selectedStage = [2];
    // this.selectedProposalDetails = [];
    // this.selectedCampaignType = undefined;
    // this.selectedProposalStatus = [];
    // this.dateTypeId = 1;
    // this.selectedOrg = [];
    if (!isOnLoad) {
      this.onGridReady(this.tempParam);
    }
  }

  setOptionsSetting() {
    this.rowSelection = 'multiple';
    this.rowGroupPanelShow = 'always';
    this.serverSideStoreType = 'full';
    this.pagination = true;
    this.paginationPageSize = 20;
    this.pivotPanelShow = 'always';
    this.groupDisplayType = 'singleColumn';

    this.autoGroupColumnDef = {
      // flex: 1,
      minWidth: 280,
    };

    this.statusBar = {
      statusPanels: [
        {
          statusPanel: 'agTotalAndFilteredRowCountComponent',
          align: 'left',
        },
        {
          statusPanel: 'agTotalRowCountComponent',
          align: 'center',
        },
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' },
      ],
    };

    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      rowDrag: true,
      enableRowGroup: true,
      // rowGroup:true,
      filter: 'agSetColumnFilter',
      filterParams: {
        applyMiniFilterWhileTyping: true,
      },
      resizable: true,
      sortable: true,
      enablePivot: true,
      enableValue: true,
    };

    // this.colResizeDefault = 'shift';

    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
    };

    this.rowModelType = 'serverSide';

    this.getServerSideStoreParams = function (params) {
      var noGroupingActive = params.rowGroupColumns.length === 0;
      var res;
      if (noGroupingActive) {
        res = {
          storeType: 'partial',
          cacheBlockSize: 100,
          maxBlocksInCache: 2,
        };
      } else {
        var topLevelRows = params.level == 0;
        res = {
          storeType: topLevelRows ? 'full' : 'partial',
          cacheBlockSize: params.level === 1 ? 5 : 2,
          maxBlocksInCache: -1,
        };
      }
      // console.log('############## NEW STORE ##############');
      // console.log(
      //   'getServerSideStoreParams, level = ' +
      //   params.level +
      //   ', result = ' +
      //   JSON.stringify(res)
      // );
      return res;
    };
    this.gridOptions = {
      // PROPERTIES
      // Objects like myRowData and myColDefs would be created in your application
      rowData: this.rowData,
      pagination: true,
      columnDefs: this.columnDefs,
      enableFilter: true,
      // rowSelection: 'single',

      // EVENTS
      // Add event handlers
      // onRowClicked: event => console.log('A row was clicked'),
      // onColumnResized: event => console.log('A column was resized'),
      // onGridReady: event => console.log('The grid is now ready'),

      // CALLBACKS
      // getRowHeight: (params) => 25
    };
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.searchValue);
  }
}
