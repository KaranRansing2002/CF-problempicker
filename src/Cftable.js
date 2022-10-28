import React,{useState,useEffect} from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios'
// import _ from 'lodash'

const columns = [
  {
    id : '0',
    label : '#',
    minWidth : 50,
    align : 'left'
  },
  {
    id:'1',
    label : 'ID',
    minWidth : 50,
    align : 'left'
  },
  {
    id:'2',
    label : 'Problem Name',
    minWidth : 170,
    align : 'center'
  },
  {
    id:'3',
    label : 'Difficulty',
    minWidth : 50,
    align : 'left'
  },
  {
    id:'4',
    label : 'index',
    minWidth : 50,
    align : 'left'
  }
];

const baseURL = " https://codeforces.com/api/problemset.problems";
const problemUrl='https://codeforces.com/problemset/problem/'
const handle='strange007'


function Cftable() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [problems,setProblems]=useState([])
  const [isSolved,setIsSolved]=useState([])
  const [numOfProbSolved,setNumOfProbsSolved]=useState(14)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(()=>{
    let interval=setInterval(()=>{
      const reqOne=axios.get(baseURL);
      const reqTwo=axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)
      axios.all([reqTwo,reqOne]).then(axios.spread((...responses) => {
        const responseOne = responses[1].data.result.problems
        const responseTwo = responses[0].data.result
        
        const passedSubmissions=responseTwo.filter((submission)=>(submission.verdict==='OK')).map((submission)=>(submission.problem.contestId+submission.problem.index))

        passedSubmissions.push("1346D","1346C")

        let myProblems=responseOne.filter((problem)=>(problem.rating && problem.rating===1600 && (!passedSubmissions.includes(problem.contestId+problem.index))))

        for(let prob of isSolved){
          if(passedSubmissions.includes(prob)){
            console.log("checking...")
            setNumOfProbsSolved(numOfProbSolved+1)
          }
        }

        setIsSolved(isSolved.filter((prob)=>(!passedSubmissions.includes(prob))))

        myProblems=myProblems.slice(0,100-numOfProbSolved)

        setProblems(myProblems)

        // console.log("probs solved",numOfProbSolved,isSolved,myProblems.length)

      })).catch(errors => {
        console.log(errors)
      })
    },2000)

    return () => {
      clearInterval(interval);
    };

  })

  useEffect(()=>{
    setProblems(problems.slice(0,100-numOfProbSolved),1000)
    // console.log(isSolved) 
  },[numOfProbSolved])
  // console.log(isSolved)
  return (
    
    <div className='w-2/3'>
      <h1 className='text-2xl'>Problems Solved : {numOfProbSolved}</h1>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}> 
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow >
                {columns.map((column) => (
                  <TableCell 
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                problems.map((problem,index)=>{
                  return(
                    <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{problem.contestId}</TableCell>
                      <TableCell><a onClick={()=>setIsSolved([...isSolved,(problem.contestId+problem.index)])} target='_blank' rel="noreferrer" href={`${problemUrl}/${problem.contestId}/${problem.index}`}>{problem.name}</a></TableCell>
                      <TableCell>{problem.rating}</TableCell>
                      <TableCell>{problem.index}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={problems.length} 
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}

export default Cftable
