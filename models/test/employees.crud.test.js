const Employee = require("../employees.model");
const expect = require("chai").expect;
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");

describe("Employees", () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getConnectionString();

      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(err);
    }
  });
  describe("Reading data", () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: "Joe",
        lastName: "Doe",
        department: "HR",
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: "Amanda",
        lastName: "Doe",
        department: "Managment",
      });
      await testEmpTwo.save();
      
    });
    it('should return all the data with "find" method', async () => {
      const employee = await Employee.find();
      const expectedLength = 2;
      expect(employee.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method.', async () => {
      const employee = await Employee.findOne({
        firstName: "Joe",
      });
      expect(employee.firstName).to.be.equal("Joe");
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe("Creating data", () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: "Joe",
        lastName: "Doe",
        department: "HR",
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe("Updating data", () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: "Joe",
        lastName: "Doe",
        department: "HR",
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: "Amanda",
        lastName: "Doe",
        department: "Managment",
      });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: "Joe" },
        { $set: { firstName: "Jones" } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: "Jones",
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: "Joe" });
      employee.firstName = "Jones";
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: "Jones",
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update many docs with "updateMany" method', async () => {
        await Employee.updateMany({}, { $set: { firstName: 'Lilly' }});
        const employees = await Employee.find();
  
        expect(employees[0].firstName).to.be.equal('Lilly');
        expect(employees[1].firstName).to.be.equal('Lilly');
      });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe("Removing data", () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: "Joe",
        lastName: "Doe",
        department: "HR",
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: "Amanda",
        lastName: "Doe",
        department: "Managment",
      });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: "Joe" });
      const removeEmployee = await Employee.findOne({
        firstName: "Joe",
      });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: "Joe" });
      await employee.remove();
      const removeEmployee = await Employee.findOne({
        firstName: "Joe",
      });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });
});
