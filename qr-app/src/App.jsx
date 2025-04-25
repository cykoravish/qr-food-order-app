

import React, { useEffect } from 'react';


import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Clients/Home';
import { CartPage } from './Pages/Clients/CartPage';
import { Category as UserCategory } from './Pages/Clients/Category'
import { PaymentsMethod } from './Pages/Clients/PaymentsMethod';
import { DashBoardPage } from './Pages/Admin/DashBoardPage';
import { NewProduct } from './Pages/Admin/NewProduct';
import { NewCategory } from './Pages/Admin/NewCategory';
import { Category } from './Pages/Admin/Category';
import { OrderSuccess } from './Pages/Clients/Order-Success';
import { ProtectedRoutes } from './Services/ProtectedRoutes';
import ScrollToTop from './components/ScrollToTop';
import { Signup } from './Pages/Auth/Signup';
import { Login } from './Pages/Auth/Login';
import QrCode from 'react-qr-code';
import { UserInfo } from './Pages/Clients/UserInfo';
import { PaymentPage } from './Pages/Clients/PaymentPage';
import { OrderUpdate } from './Pages/Admin/OrderUpdate';
import { TotalSale } from './Pages/Admin/TotalSale';
import { GraphicalPage } from './Pages/Admin/GraphicalPage';
import { ProductsDetails } from './Pages/Clients/ProductsDetails';
import { Bounce, ToastContainer } from 'react-toastify';
import { socket } from './Services/Socket';

// "undefined" means the URL will be computed from the `window.location` object


function App() {
  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected to server, socket ID:', socket.id);
    });


    return () => {
      socket.off('connection');
      socket.off('newOrder');

    };
  }, []);

  return (
    <>

      <QrCode value='https://food-order-app-1-jddi.onrender.com/' className='hidden' />
      <ScrollToTop />
      <Routes className='min-w-[375px] h-auto'>
        <Route index path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route index path='/user-info' element={<UserInfo />} />
        <Route path='/' element={<Home />} />
        <Route path='/product/:id' element={<ProductsDetails />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/cart-bill' element={<PaymentsMethod />} />
        <Route path='/:category' element={< UserCategory />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/order-success' element={<OrderSuccess />} />

  

        {/* Admin Protected Routes */}
        <Route path='/' element={<ProtectedRoutes />}>
          <Route index path='/admin' element={<DashBoardPage />} />
          <Route path='/admin/createProduct' element={<NewProduct />} />
          <Route path='/admin/Category' element={<Category />} />
          <Route path='/admin/newCategory' element={<NewCategory />} />
          <Route path='/admin/pending-orders' element={<OrderUpdate />} />
          <Route path='/admin/totelsale' element={<TotalSale />} />
          <Route path='/admin/data-visualize' element={<GraphicalPage />} />
        </Route>
      </Routes >
      <ToastContainer position="top-right"
        autoClose={5000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce} />

    </>
  );
}

export default App;
