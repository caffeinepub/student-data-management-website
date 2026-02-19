import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllStudents } from '../hooks/useQueries';
import { Loader2, Users, Pencil } from 'lucide-react';
import { StudentEditForm } from './StudentEditForm';
import type { Student } from '../backend';

export function StudentList() {
  const { data: students, isLoading, error } = useGetAllStudents();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md border-destructive">
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load students. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!students || students.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Records
          </CardTitle>
          <CardDescription>All registered students will appear here</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No students found. Add your first student to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Records
          </CardTitle>
          <CardDescription>
            {students.length} {students.length === 1 ? 'student' : 'students'} registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <Card key={student.uid} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p className="text-lg font-semibold text-foreground">{student.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-base text-foreground">{student.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">UID</p>
                        <p className="text-base font-mono text-foreground">{student.uid}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStudent(student)}
                      className="shrink-0"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingStudent && (
        <StudentEditForm
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </>
  );
}
