var Record = function(){
    this.index = 0;
    this.institution = "";
    this.category = "";
    this.state = "";
    this.position = "";
    this.avgSalary = "";
    this.avgRaisePCT = "";
    this.count = "";
    this.avgCompensation = "";
    this.salaryEqualityPCT = "";
}
Record.prototype = {
    translateAttributes: function (index, Obj){
        this.index = index;
        this.institution = Obj.Institution;
        this.category = Obj.Category;
        this.state = Obj.State;
        this.position = Obj.Position;
        this.avgSalary = Obj.AvgSalary;
        this.avgRaisePCT = Obj.AvgRaisePCT;
        this.count = Obj.Count;
        this.avgCompensation = Obj.AvgCompensation;
        this.salaryEqualityPCT = Obj.SalaryEqualityPCT;
        return this;
    }
}