import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';

import Admin from './pages/admin/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllUsers from './pages/admin/AllUsers';
import AllOrders from './pages/admin/AllOrders';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import BannerManagement from './pages/admin/BannerManagement';

function App() {
  return (
    <div className="App">
      
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

<Routes>
  <Route path="/auth" element={<Authentication />} />
  <Route path="/" element={<Home />} />

  {/* Customer Protected Routes */}
  <Route path="/cart" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <Cart />
    </ProtectedRoute>
  } />
  <Route path="/profile" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <Profile />
    </ProtectedRoute>
  } />
  <Route path="/product/:id" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <IndividualProduct />
    </ProtectedRoute>
  } />
  <Route path="/category/:category" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <CategoryProducts />
    </ProtectedRoute>
  } />

  {/* Admin Protected Routes */}
  <Route path="/admin" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <Admin />
    </ProtectedRoute>
  } />
  <Route path="/all-products" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AllProducts />
    </ProtectedRoute>
  } />
  <Route path="/all-users" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AllUsers />
    </ProtectedRoute>
  } />
  <Route path="/all-orders" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AllOrders />
    </ProtectedRoute>
  } />
  <Route path="/new-product" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <NewProduct />
    </ProtectedRoute>
  } />
  <Route path="/update-product/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <UpdateProduct />
    </ProtectedRoute>
  } />
  <Route path="/banner-management" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <BannerManagement />
  </ProtectedRoute>
} />
</Routes>



    </div>
  );
}

export default App;
