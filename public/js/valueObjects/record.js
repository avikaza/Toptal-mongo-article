var FacultyRecord = function(){
    this.index = 0;
    this.Institution = "";
    this.Category = "";
    this.State = "";
    this.Position = "";
    this.AvgSalary = "";
    this.AvgRaisePCT = "";
    this.Count = "";
    this.AvgCompensation = "";
    this.SalaryEqualityPCT = "";
}
FacultyRecord.prototype = {
    translateAttributes: function (index, Obj){
        this.index = index;
        this.Institution = Obj.Institution;
        this.Category = Obj.Category;
        this.State = Obj.State;
        this.Position = Obj.Position;
        this.AvgSalary = Obj.AvgSalary;
        this.AvgRaisePCT = Obj.AvgRaisePCT;
        this.Count = Obj.Count;
        this.AvgCompensation = Obj.AvgCompensation;
        this.SalaryEqualityPCT = Obj.SalaryEqualityPCT;
        return this;
    }
}

var PayRollRecord = function(){
    this.index = 0;
    this.State = "";
    this.GovernmentFunction = "";
    this.FullTimeEmployees = "";
    this.VariationPCT = "";
    this.FullTimePay = "";
    this.PartTimeEmployees = "";
    this.PartTimePay = "";
    this.PartTimeHours = "";
    this.FullTimeEquivalentEmployment = "";
    this.TotalEmployees = "";
    this.TotalMarchPay = "";
}
PayRollRecord.prototype = {
    translateAttributes: function (index, Obj){
        this.index = index;
        this.State = Obj.State;
        this.GovernmentFunction = Obj.GovernmentFunction;
        this.FullTimeEmployees = Obj.FullTimeEmployees;
        this.VariationPCT = Obj.VariationPCT;
        this.FullTimePay = Obj.FullTimePay;
        this.PartTimeEmployees = Obj.PartTimeEmployees;
        this.PartTimePay = Obj.PartTimePay;
        this.PartTimeHours = Obj.PartTimeHours;
        this.FullTimeEquivalentEmployment = Obj.FullTimeEquivalentEmployment;
        this.TotalEmployees = Obj.TotalEmployees;
        this.TotalMarchPay = Obj.TotalMarchPay;
        return this;
    }
}