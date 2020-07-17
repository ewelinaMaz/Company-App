const Employees = require("../employees.model.js");
const expect = require("chai").expect;
const mongoose = require("mongoose");

describe("Employees", () => {
  it("should throw an error if any arg is missing", () => {
    const emp0 = new Employees({});
    const emp1 = new Employees({ firstName: 'Joe', department: 'HR' });
    const emp2 = new Employees({ firstName: 'Joe', lastName: 'Doe' });
    const emp3 = new Employees({ lastName: 'Doe', department: 'HR' });

    const cases = [emp0, emp1, emp2, emp3];
    for (let employee of cases) {
      employee.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if any arg is not a string', () => {
      const emp0 = new Employees({firstName: [], lastName: 'Doe', department: 'HR'});
      const emp1 = new Employees({firstName: 'Joe', lastName: 'Doe', department: {}});
      const emp2 = new Employees({firstName: 'Joe', lastName: [], department: 'HR'});
    const cases = [emp0, emp1, emp2];
    for (let employee of cases) {

      employee.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should not throw an error if "arg are OK', () => {
    const emp = new Employees({firstName: 'Joe', lastName: 'Doe', department: 'HR'});

      emp.validate((err) => {
        expect(err).to.not.exist;
      });
    });

  after(() => {
    mongoose.models = {};
  });
});
