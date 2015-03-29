'use strict';
app.controller('AppCtrl', function ($scope, $http) {
    $scope.records = [];
    $scope.sourceRecords = [];
    $scope.csvHTMLTemplateLink = "";
    $scope.totalServerItems = 0;
    $scope.pageSize = 50;
    $scope.pagingOptions = {
        pageSizes: [],
        pageSize: $scope.pageSize,
        currentPage: 1
    };
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.loadData = function() {
        var httpRequest = $http({
            method: 'GET',
            url: 'http://52.10.36.38:3000/collections/faculty'
        }).success(function(data, status) {
            var i, record;
            for(var i = 0; i < data.length; i = i + 1){
                record = new Record();
                $scope.sourceRecords.push(record.translateAttributes(i, data[i]));
            }
            $scope.filterData(0, $scope.pageSize);
            $scope.setPagingData($scope.sourceRecords,1,100);
            $scope.showCVSExportDownloadLink();
        });
    };

    $scope.filterData = function(startIndex, endIndex){
        $scope.records = $scope.sourceRecords.filter(function (el) {
            return (el.index >= startIndex && el.index <= endIndex - 1);
        });
    }

    $scope.myColumns = [{ field: 'institution', displayName: 'Institution'},
        { field: 'category', displayName: 'Category' },
        { field: 'state', displayName: 'State' },
        { field: 'position', displayName: 'Position'},
        { field: 'avgSalary', displayName: 'AvgSalary' },
        { field: 'avgRaisePCT', displayName: 'AvgRaisePCT' },
        { field: 'count', displayName: 'Count'},
        { field: 'avgCompensation', displayName: 'AvgCompensation' },
        { field: 'salaryEqualityPCT', displayName: 'SalaryEqualityPCT' }
    ];
    $scope.ngGridView = {
        data: 'records',
        showFooter: true,
        columnDefs: 'myColumns',
        enablePaging: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };

    $scope.setPagingData = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.totalServerItems = data.length;
        if($scope.pagingOptions.pageSizes.length === 0){
            for(var i = 1; i < $scope.totalServerItems/$scope.pageSize; i = i + 1){
                $scope.pagingOptions.pageSizes.push(i*$scope.pageSize);
            }
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        $scope.filterData((page > 1? page-1:0)*$scope.pageSize, page*$scope.pageSize);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.showCVSExportDownloadLink = function() {
        var keyCollections = [];
        for (var grd in $scope.myColumns) {
            keyCollections.push($scope.myColumns[grd].field);
        }
        var csvFileDatas = '';
        function StringifyCSVData(strKey) {
            if (strKey == null) { // we want to catch anything null-ish, hence just == not ===
                return '';
            }
            if (typeof (strKey) === 'number') {
                return '' + strKey;
            }
            if (typeof (strKey) === 'boolean') {
                return (strKey ? 'TRUE' : 'FALSE');
            }
            if (typeof (strKey) === 'string') {
                return strKey.replace(/"/g, '""');
            }
            return JSON.stringify(strKey).replace(/"/g, '""');
        }
        function swapLastCommaForNewline(strKey) {
            var newStr = strKey.substr(0, strKey.length - 1);
            return newStr + "\n";
        }
        for (var k in keyCollections) {
            csvFileDatas += '"' + StringifyCSVData(keyCollections[k]) + '",';
        }
        csvFileDatas = swapLastCommaForNewline(csvFileDatas);
        var getGridData = $scope.sourceRecords;
        for (var gridRow in getGridData) {
            for (k in keyCollections) {
                var currentReowCell;
                currentReowCell = getGridData[gridRow][keyCollections[k]];
                csvFileDatas += '"' + StringifyCSVData(currentReowCell) + '",';
            }
            csvFileDatas = swapLastCommaForNewline(csvFileDatas);
        }

        var csvHTMLTemplateLink = "<a href=\"data:text/csv;charset=UTF-8,";
        csvHTMLTemplateLink += encodeURIComponent(csvFileDatas);
        csvHTMLTemplateLink += "\" download=\"Export-from-Grid.csv\">Export Data in CSV file</a>";
        $("#link").append(csvHTMLTemplateLink);
    }

    $scope.loadData();
});