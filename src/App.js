// import logo from './logo.svg';
import './App.css';
import Cftable from './Cftable';

function App() {
  return (
    <div className="App h-full w-full bg-[#121217] text-center p-2 ">
      <h1 className='text-white text-4xl font-bold '>Welcome Karan !</h1>
      <div className='main w-full flex justify-center p-4'>
        <Cftable/>
      </div>
    </div>
  );
}

export default App;
