import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await userService.getAll();
      setStudents(res.data.filter(u => u.role === 'student'));
    } catch (err) {
      console.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Students</h1>
        <p>Manage student accounts</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Books Borrowed</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <span className="badge badge-success">{student.studentId || '-'}</span>
                </td>
                <td>{student.department || '-'}</td>
                <td>{student.phone || '-'}</td>
                <td>
                  <span className="badge badge-warning">{student.borrowedBooks?.length || 0}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
