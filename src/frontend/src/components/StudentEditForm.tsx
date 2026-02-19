import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateStudent } from '../hooks/useQueries';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Student } from '../backend';

interface StudentEditFormProps {
  student: Student;
  onClose: () => void;
}

export function StudentEditForm({ student, onClose }: StudentEditFormProps) {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);

  const updateStudentMutation = useUpdateStudent();

  useEffect(() => {
    setName(student.name);
    setEmail(student.email);
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await updateStudentMutation.mutateAsync({
        uid: student.uid,
        name: name.trim(),
        email: email.trim(),
      });

      toast.success('Student updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update student. Please try again.');
      console.error('Error updating student:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update student information. UID cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-uid">UID</Label>
              <Input
                id="edit-uid"
                type="text"
                value={student.uid}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={updateStudentMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={updateStudentMutation.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateStudentMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateStudentMutation.isPending}>
              {updateStudentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
