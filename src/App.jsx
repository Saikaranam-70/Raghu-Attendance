import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import ReadXL from './components/ReadXl/ReadXL'
import { Route, Routes } from 'react-router-dom'
import StudentAttendance from './components/StudentAttendance/StudentAttendance'
import AttendanceViewer from './components/ReadXl/AttendanceViewer'

const App = () => {
  return (
    <div>
      <Navbar />
      {/* <Home />
      <ReadXL /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/attendance/:regdNo' element={<StudentAttendance />} />
        
      </Routes>
      {/* <ReadXL /> */}
      <AttendanceViewer />
    </div>
  )
}

export default App
