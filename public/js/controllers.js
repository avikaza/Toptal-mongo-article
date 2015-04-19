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
    $scope.facultySourceSchema = [{field: 'UnitID', displayName: 'UnitID', type :'String', isDisplay: false},
        {field: 'InstitutionName', displayName: 'InstitutionName', type :'String', isDisplay: true},
        {field: 'AVGSalaryAll', displayName: 'AVGSalaryAll', type :'Number', isDisplay: true},
        {field: 'AVGSalaryProfessors', displayName: 'AVGSalaryProfessors', type :'Number', isDisplay: true},
        {field: 'AVGSalaryAssociateProfessors', displayName: 'AVGSalaryAssociateProfessors', type :'Number', isDisplay: true},
        {field: 'AVGSalaryLecturers', displayName: 'AVGSalaryLecturers', type :'Number', isDisplay: true},
        {field: 'AVGSalaryInstructors', displayName: 'AVGSalaryInstructors', type :'Number', isDisplay: true},
        {field: 'City', displayName: 'City', type :'String', isDisplay: true},
        {field: 'State', displayName: 'State', type :'String', isDisplay: true},
        {field: 'ZIPCode', displayName: 'ZIPCode', type :'String', isDisplay: true},
        {field: 'AVGSalaryInstructors', displayName: 'AVGSalaryInstructors', type :'Number', isDisplay: true},
        {field: 'MenStaffCount', displayName: 'MenStaffCount', type :'Number', isDisplay: true},
        {field: 'WomenStaffCount', displayName: 'WomenStaffCount', type :'Number', isDisplay: true}
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
        for (var grd in $scope.colDefinitions) {
            keyCollections.push($scope.colDefinitions[grd].field);
        }
        var csvFileDatas = '';
        function StringifyCSVData(strKey) {
            if (strKey == null || strKey == undefined) { // we want to catch anything null-ish, hence just == not ===
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
            return JSON.stringify(strKey) !== undefined? JSON.stringify(strKey).replace(/"/g, '""'):"";
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
        $("#exportLink").html(csvHTMLTemplateLink);
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
                text: "{ $project : { _id: 0, employeeId: 1, firstName : '$name.first',  lastName : '$name.last', last4Social: { $substr: [ '$social', 6, 4 ] }, 'TotalBenefits' : {$add : ['$salary', '$bonus', '$insurance']}}",
                explanation: "User wants to suppress the default _id primary key from coming in results, he wants the employeeId, first name, last name, last 4 digits of social and total benefits by summing up employee salary, bonus and insurance fields",
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/project/#pipe._S_project"
            }
        ],
        "match": [
            {
                text: "{ $match : { employeeCity: {$in : ['Arlington', 'Dallas', 'Sacremento']}, salary : { $gt : 30000, $lte : 80000}, department : 'Sales'} }",
                explanation: "Here user is trying to get all sales employees who are based in Alrington, Dallas, and Sacremento with salaries between 30,000 and 80,000. Always try and use $match as early as possible in your stages because it reduces the amount of data we have to run other transformations on",
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/match/"
            }
        ],
        "group": [
            {
                text: "{ $group: { _id: { department: '$department', city: '$employeeCity'}, AvgSalary: {$avg: '$salary'}, MaxSalary: {$max: '$salary'}, MinSalary: {$min: '$salary'}, Count: {$sum: 1} } }",
                explanation: "This will give us count of employees and their salary averages, max and mins grouped by city and department",
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/group/"
            }
        ],
        "limit": [
            {
                text: '{ $limit: 120 }',
                explanation: "To return only first 120 documents of the result-set",
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/limit/"
            }
        ],
        "skip": [
            {
                text: '{ $skip: 100 }',
                explanation: "To ignore first 100 documents and return remaining result-set",
                url: "http://docs.mongodb.org/manual/reference/operator/aggregation/skip/"
            }
        ],
        "sort": [
            {
                text: '{ $sort: { salary: -1 } }',
                explanation: "Sort the result-set in descending order of salary",
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
        var url='http://52.10.36.38:3000/aggregate?collection='+$scope.schemaType+'&statement='+$scope.query;
	var httpRequest = $http({
            method: 'GET',
            url: url 
        }).success(function(data, status) {
		$scope.results = data;
            if(data.length > 0){
                $scope.colDefinitions = [];
	    	for(var index in data[0]){
	    		var definitions = {};
			definitions['field'] = index;
			definitions['displayName'] = index.toUpperCase();
			if(index === "_id"){
				definitions['visible'] = false;
			}
			$scope.colDefinitions.push(definitions);
	   	}

                setTimeout($scope.showCVSExportDownloadLink, 1000);
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
