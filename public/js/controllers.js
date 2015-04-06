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

    $scope.schemaType = "Faculty";
    $scope.facultySourceSchema = [{ field: 'Institution', displayName: 'Institution', type: 'String', isDisplay: true},
        { field: 'Category', displayName: 'Category', type: 'String', isDisplay: true},
        { field: 'State', displayName: 'State', type: 'String', isDisplay: true},
        { field: 'Position', displayName: 'Position', type: 'String', isDisplay: true},
        { field: 'AvgSalary', displayName: 'AvgSalary', type: 'Number', isDisplay: true},
        { field: 'AvgRaisePCT', displayName: 'AvgRaisePCT', type: 'Number', isDisplay: true},
        { field: 'Count', displayName: 'Count', type: 'Number', isDisplay: true},
        { field: 'AvgCompensation', displayName: 'AvgCompensation', type: 'Number', isDisplay: true},
        { field: 'SalaryEqualityPCT', displayName: 'SalaryEqualityPCT', type: 'Number', isDisplay: true}
    ];

    $scope.payRollSourceSchema = [{ field: 'State', displayName: 'State', type: 'String', isDisplay: true},
        { field: 'GovernmentFunction', displayName: 'GovernmentFunction', type: 'String', isDisplay: true},
        { field: 'FullTimeEmployees', displayName: 'FullTimeEmployees', type: 'Number', isDisplay: true},
        { field: 'VariationPCT', displayName: 'VariationPCT', type: 'Number', isDisplay: true},
        { field: 'FullTimePay', displayName: 'FullTimePay', type: 'Number', isDisplay: true},
        { field: 'PartTimeEmployees', displayName: 'PartTimeEmployees', type: 'Number', isDisplay: true},
        { field: 'PartTimePay', displayName: 'PartTimePay', type: 'Number', isDisplay: true},
        { field: 'PartTimeHours', displayName: 'PartTimeHours', type: 'Number', isDisplay: true},
        { field: 'FullTimeEquivalentEmployment', displayName: 'FullTimeEquivalentEmployment', type: 'Number', isDisplay: true},
        { field: 'TotalEmployees', displayName: 'TotalEmployees', type: 'Number', isDisplay: true},
        { field: 'TotalMarchPay', displayName: 'TotalMarchPay', type: 'Number', isDisplay: true}
    ];

});

app.controller('QueryController', function ($scope, $http) {
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
        var getGridData = $scope.results;
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
    $scope.commandList = [
        {
            name: "Project (Select raw or calculated columns)",
            command: "$project"
        },
        {
            name: "Match (Filter rows by conditions on columns)",
            command: "$match"
        },
        {
            name: "Group (Group by one or more columns and aggregate other columns)",
            command: "$group"
        },
        {
            name: "Limit (Get first n rows)",
            command: "$limit"
        },
        {
            name: "Skip (Skip first n rows and get remaining)",
            command: "$skip"
        },
        {
            name: "Sort (Order by one or more input columns from last stage)",
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
	$scope.consolidateStages();
    };
    $scope.deletequery = function(idx, e){
        $scope.groups.splice(idx, 1);
	$scope.consolidateStages();
    };
    $scope.addNewStage = function(){
        $scope.groups.push({
            stageCommand: "$project",
            stageName: "",
            stageQuery: "",
            open: true
        });
    };
    $scope.results = [];
    $scope.colDefinitions = [];
    $scope.runAggregation = function () {
        var httpRequest = $http({
            method: 'POST',
            url: 'http://52.10.36.38:3000/aggregate',
            data: {collection: $scope.schemaType, statement: $scope.query}
        }).success(function(data, status) {
	    $scope.results = data;
            if(data.length > 0){
	    	for(var index in data[0]){
	    		var definitions = {};
			definitions['field'] = index;
			definitions['displayName'] = index.toUpperCase();
			$scope.colDefinitions.push(definitions);
	   	}
	     }else{
	    	$scope.results.push({result:"Please check your query and if the collection contains the query parameters."});
		$scope.colDefinitions.push({field :"result", displayName:"No Results were found"});
	     }	
        });
    };
    $scope.ngGridView = {
       	data: 'results',
	columnDefs: 'colDefinitions'
    };
    $scope.consolidateStages = function (){
        var consolidatedQuery = [];
        for (var k=0; k < $scope.groups.length; k++){
		if($scope.groups[k].stageQuery != ""){
            		consolidatedQuery.push($scope.groups[k].stageQuery);
		}
        }
        $scope.query = "["+consolidatedQuery.toString()+"]";
    };
});
