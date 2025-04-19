
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Clients/Home';
import { AllDishes } from './Pages/Clients/AllDishes';
import { CartPage } from './Pages/Clients/CartPage';
import { Category as UserCategory } from './Pages/Clients/Category'
import { PaymentsMethod } from './Pages/Clients/PaymentsMethod';
import { DashBoardPage } from './Pages/Admin/DashBoardPage';
import { NewProduct } from './Pages/Admin/NewProduct';
import { NewCategory } from './Pages/Admin/NewCategory';
import { Category } from './Pages/Admin/Category';
import { OrderSuccess } from './Pages/Clients/Order-Success';
import { ProtectedRoutes } from './Services/ProtectedRoutes';
import React from 'react';
import ScrollToTop from './components/ScrollToTop';
import { Signup } from './Pages/Auth/Signup';
import { Login } from './Pages/Auth/Login';
import QrCode from 'react-qr-code';

function App() {
  return (
    <>
      <ScrollToTop />
      <QrCode tabIndex={<Signup />} value='https://food-order-app-1-jddi.onrender.com/signup' className='hidden' />
      <Routes>
        <Route index path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        {/* <Route path='/burger' element={<Burger />} /> */}
        <Route path='/allDishes' element={< AllDishes />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/bill' element={<PaymentsMethod />} />
        <Route path='/order-success/' element={<OrderSuccess />} />
        <Route path='/:category' element={< UserCategory />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/admin' element={<DashBoardPage />} />
          <Route path='/admin/createProduct' element={<NewProduct />} />
          <Route path='/admin/Category' element={<Category />} />
          <Route path='/admin/newCategory' element={<NewCategory />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
