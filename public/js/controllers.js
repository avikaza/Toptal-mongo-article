'use strict';
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
app.controller('AppCtrl', function ($scope, $http) {
    $scope.records = [];
    $scope.sourceRecords = [];
    $scope.csvHTMLTemplateLink = "";
    $scope.totalServerItems = 0;
    $scope.pageSize = 50;
    $scope.schemaType = "Faculty";
    $scope.displaySchema = [];
    $scope.pagingOptions = {
        pageSizes: [],
        pageSize: $scope.pageSize,
        currentPage: 1
    };
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.filterData = function(startIndex, endIndex){
        $scope.records = $scope.sourceRecords.filter(function (el) {
            return (el.index >= startIndex && el.index <= endIndex - 1);
        });
    };

    $scope.facultySchema = [{ field: 'institution', displayName: 'Institution', type: 'String'},
        { field: 'category', displayName: 'Category', type: 'String'},
        { field: 'state', displayName: 'State', type: 'String'},
        { field: 'position', displayName: 'Position', type: 'String'},
        { field: 'avgSalary', displayName: 'AvgSalary', type: 'Number'},
        { field: 'avgRaisePCT', displayName: 'AvgRaisePCT', type: 'Number'},
        { field: 'count', displayName: 'Count', type: 'Number'},
        { field: 'avgCompensation', displayName: 'AvgCompensation', type: 'Number'},
        { field: 'salaryEqualityPCT', displayName: 'SalaryEqualityPCT', type: 'Number'}
    ];

    $scope.payRollSchema = [{ field: 'State', displayName: 'State', type: 'String'},
        { field: 'GovernmentFunction', displayName: 'GovernmentFunction', type: 'String'},
        { field: 'FullTimeEmployees', displayName: 'FullTimeEmployees', type: 'Number'},
        { field: 'VariationPCT', displayName: 'VariationPCT', type: 'Number'},
        { field: 'FullTimePay', displayName: 'FullTimePay', type: 'Number'},
        { field: 'PartTimeEmployees', displayName: 'PartTimeEmployees', type: 'Number'},
        { field: 'PartTimePay', displayName: 'PartTimePay', type: 'Number'},
        { field: 'PartTimeHours', displayName: 'PartTimeHours', type: 'Number'},
        { field: 'FullTimeEquivalentEmployment', displayName: 'FullTimeEquivalentEmployment', type: 'Number'},
        { field: 'TotalEmployees', displayName: 'TotalEmployees', type: 'Number'},
        { field: 'TotalMarchPay', displayName: 'TotalMarchPay', type: 'Number'}
    ];

    $scope.ngGridView = {
        data: 'records',
        showFooter: true,
        columnDefs: 'facultySchema',
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
    };

});

app.controller('QueryController', function ($scope, $http) {
    $scope.commandList = [
        {
            name: "Project",
            command: "$project"
        },
        {
            name: "Match",
            command: "$match"
        },
        {
            name: "Group",
            command: "$group"
        },
        {
            name: "Limit",
            command: "$limit"
        },
        {
            name: "Skip",
            command: "$skip"
        },
        {
            name: "Sort",
            command: "$sort"
        }
    ];
    $scope.commandHelp = {
        "project": [
            {
                text: '{ $project : { Institution : "institution name" , AvgSalary : 5000 } }',
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/project/#pipe._S_project"
            }
        ],
        "match": [
            {
                text: '{ $match: { ftp: { $gte: 100*1000 } } }',
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/match/"
            }
        ],
        "group": [
            {
                text: '{ $group: { _id: "$State", ftp: { $sum: "$AvgSalary" } } }',
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/group/"
            }
        ],
        "limit": [
            {
                text: '{ $limit: <positive integer> }',
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/limit/"
            }
        ],
        "skip": [
            {
                text: '{ $skip: <positive integer> }',
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/skip/"
            }
        ],
        "sort": [
            {
                text: '{ $sort: { ftp: 1 } }',
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/sort/"
            }
        ]
    };
    $scope.groups = [
        {
            stageCommand: "$project",
            stageName: "",
            stageQuery: "",
            open: true
        }
    ];

    $scope.stopExpanding = function(e){
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    $scope.changeIndex = function(idx, option){
        if(option === "up" && idx > 0){
            $scope.groups.move(idx, idx - 1);
        }else if(option === "down" && idx < $scope.groups.length - 1) {
            $scope.groups.move(idx, idx + 1);
        }
    };
    $scope.deletequery = function(idx, e){
        $scope.groups.splice(idx, 1);
    };
    $scope.addNewStage = function(){
        $scope.groups.push({
            stageCommand: "$project",
            stageName: "",
            stageQuery: "",
            open: true
        });
    };
    $scope.runAggregation = function () {
        $scope.consolidateStages();        
        var httpRequest = $http({
            method: 'POST',
            url: 'http://52.10.36.38:3000/aggregate',
            data: {collection: $scope.schemaType, statement: $scope.query}
        }).success(function(data, status) {
            var i, record;            
            for(var i = 0; i < data.length; i++){
                record = new Record();
                $scope.sourceRecords.push(record.translateAttributes(i, data[i]));
            }
            $scope.filterData(0, $scope.pageSize);
            $scope.setPagingData($scope.sourceRecords,1,100);
            $scope.showCVSExportDownloadLink();
        });
    };
    $scope.consolidateStages = function (){
        var consolidatedQuery = [];
        for (var k=0; k < $scope.groups.length; k++){
            consolidatedQuery.push($scope.groups[k].stageQuery);
        }
        $scope.query = "["+consolidatedQuery.toString()+"]";
    };
});