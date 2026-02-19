import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Student = {
    name : Text;
    email : Text;
    uid : Text;
  };

  module Student {
    public func compare(student1 : Student, student2 : Student) : Order.Order {
      switch (Text.compare(student1.name, student2.name)) {
        case (#equal) { Text.compare(student1.uid, student2.uid) };
        case (order) { order };
      };
    };

    public func compareByEmail(student1 : Student, student2 : Student) : Order.Order {
      Text.compare(student1.email, student2.email);
    };

    public func compareByUid(student1 : Student, student2 : Student) : Order.Order {
      Text.compare(student1.uid, student2.uid);
    };
  };

  var students = Array.empty<Student>();

  public shared ({ caller }) func addStudent(name : Text, email : Text, uid : Text) : async () {
    let newStudent : Student = { name; email; uid };
    students := students.concat([newStudent]);
  };

  public query ({ caller }) func getStudent(uid : Text) : async Student {
    let iter = students.find(func(s) { s.uid == uid });
    switch (iter) {
      case (null) { Runtime.trap("Student does not exist") };
      case (?student) { student };
    };
  };

  public shared ({ caller }) func updateStudent(uid : Text, name : Text, email : Text) : async () {
    var updated = false;
    students := students.map(
      func(student) {
        if (Text.equal(student.uid, uid)) {
          updated := true;
          { name; email; uid };
        } else {
          student;
        };
      }
    );
    if (not updated) {
      Runtime.trap("Student with uid '" # uid # "' not found");
    };
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    students.sort();
  };

  public query ({ caller }) func getAllStudentsSortedByEmail() : async [Student] {
    students.sort(Student.compareByEmail);
  };
};
