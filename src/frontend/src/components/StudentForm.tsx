import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddStudent } from '../hooks/useQueries';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function StudentForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');

  const addStudentMutation = useAddStudent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim() || !uid.trim()) {
      toast.error('All fields are required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await addStudentMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        uid: uid.trim(),
      });

      // Clear form on success
      setName('');
      setEmail('');
      setUid('');
      toast.success('Student added successfully!');
    } catch (error) {
      toast.error('Failed to add student. Please try again.');
      console.error('Error adding student:', error);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Student
        </CardTitle>
        <CardDescription>Enter student information to create a new record</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={addStudentMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={addStudentMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uid">UID</Label>
            <Input
              id="uid"
              type="text"
              placeholder="Enter unique ID"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              disabled={addStudentMutation.isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={addStudentMutation.isPending}
          >
            {addStudentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
