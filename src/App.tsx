import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { List } from './pages/List';
import { Add } from './pages/Add';
import { Edit } from './pages/Edit';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import { PrivateRouter } from './PrivateRouter';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/products'
          element={
            <PrivateRouter>
              <List />
            </PrivateRouter>
          }
        />
        <Route
          path='/products/add'
          element={
            <PrivateRouter>
              <Add />
            </PrivateRouter>
          }
        />
        <Route
          path='/products/:id'
          element={
            <PrivateRouter>
              <Edit />
            </PrivateRouter>
          }
        />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
