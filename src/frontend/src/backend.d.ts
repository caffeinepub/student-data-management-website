import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Student {
    uid: string;
    name: string;
    email: string;
}
export interface backendInterface {
    addStudent(name: string, email: string, uid: string): Promise<void>;
    getAllStudents(): Promise<Array<Student>>;
    getAllStudentsSortedByEmail(): Promise<Array<Student>>;
    getStudent(uid: string): Promise<Student>;
    updateStudent(uid: string, name: string, email: string): Promise<void>;
}
