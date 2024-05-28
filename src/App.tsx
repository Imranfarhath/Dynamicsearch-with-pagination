import {SetStateAction, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [limit,setlimit]=useState(10);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [empname,setempname]=useState("");
  useEffect(() => {
    setLoading(true);
    fetch('https://hub.dummyapis.com/employee?noofRecords=1000')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((json) => {
        setEmployees(json);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  function handlechange(e: { target: { value: SetStateAction<number>; }; })
  {
    setlimit(e.target.value);
  }

  const filteredEmployees = employees.filter((emp) =>
    (
      (emp.salary.toString().includes(searchQuery))||((emp.email.toLowerCase()).includes(searchQuery.toLowerCase()))||((emp.firstName.toLowerCase()+" "+emp.lastName.toLowerCase()).includes(searchQuery.toLowerCase()))||(emp.id.toString().includes(searchQuery))||((emp.address).includes(searchQuery))
    )
  );

  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePage=(page)=>{
    setCurrentPage(page);
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredEmployees.length / limit))
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>

    <div className='container-fluid'>
      <div className='row'>
        <div className='col'>
          <div className='text-start'>
            page:
            <select name='limit' id='limit' onChange={handlechange}>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10} selected>10</option>
            </select>
          </div>
        </div>
        <div className='col'>
          <div className='text-end'>
            <input type="text" placeholder="Search by keyword" value={searchQuery} onChange={handleSearch} className="search-input rounded-4 ps-2"/>
          </div>
        </div>
      </div>
      <div className='m-3'>
      <table className='table table-dark'>
        <thead>
          <tr className=''>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {displayedEmployees.map((emp, index) => (
            <tr key={index} className='table table-light'>
              <td>{emp.id}</td>
              <td>{emp.firstName+" "+emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.address}</td>
              <td>{emp.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>

          
      

      <div className="pagination justify-content-center">
        <button className="page-item" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous page
        </button>

        {(currentPage-3)>0?<button className='page-item' onClick={()=>handlePage(1)}>1</button>:null}
        {(currentPage-3)>0?<button className='page-item' onClick={()=>handlePage(currentPage)} disabled={true}>...</button>:null}

        {currentPage-2>0?<button className="page-item" onClick={()=>handlePage(currentPage-2)}>
          {currentPage-2}
        </button>:null}

        {currentPage-1>0?<button className="page-item" onClick={()=>handlePage(currentPage-1)}>
          {currentPage-1}
        </button>:null}

 
        <button className="btn btn-primary page-item" onClick={handlePrevPage} disabled={true}>
          {currentPage}
        </button>

        {currentPage+1<(filteredEmployees.length/limit)?<button className="page-item" onClick={()=>handlePage(currentPage+1)}>
          {currentPage+1}
        </button>:null}

        {currentPage+2<(filteredEmployees.length/limit)?<button className="page-item" onClick={()=>handlePage(currentPage+2)}>
          {currentPage+2}
        </button>:null}

        {(currentPage+2)<((filteredEmployees.length/limit)-1)?<button className='page-item' onClick={()=>handlePage(currentPage)} disabled={true}>...</button>:null}
        {(currentPage+2)<=((filteredEmployees.length/limit))?<button className='page-item' onClick={()=>handlePage(Math.ceil(filteredEmployees.length/limit))}>{Math.ceil(filteredEmployees.length/limit)}</button>:null}
        <button
          className="page-item"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(filteredEmployees.length / limit)}
        >
          Next page
        </button>
      </div>
    </>
  );
}

export default App;
