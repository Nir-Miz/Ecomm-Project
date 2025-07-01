import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import NavBar from './Components/NavBar/NavBar';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ProductsList from './Components/PruductsPage/ProductsList';
import ProductDetails from './Components/PruductsPage/ProductDetails/ProductDetails';
import Cart from './Components/Cart/Cart';
import OrderDetails from './Components/Order/OrderDetails';
import Orders from './Components/Order/Orders';
import UserManagement from './Components/AdminPage/UserManagement/UserManagement';
import ProductManagement from './Components/AdminPage/ProductManagement/ProductManagement';
import OrderManagement from './Components/AdminPage/OrderManagement/OrderManagement';
import Footer from './Components/Footer/Footer';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.layoutContainer}>
      {/* Navigation bar component */}
      <NavBar />

      {/* Main content area where routes are rendered */}
      <main>
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />

          {/* User registration page */}
          <Route path="/register" element={<Register />} />

          {/* User login page */}
          <Route path="/login" element={<Login />} />

          {/* Products listing page */}
          <Route path="/products" element={<ProductsList />} />

          {/* Product details page, dynamic route by product ID */}
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Shopping cart page */}
          <Route path="/cart" element={<Cart />} />

          {/* Order details page, dynamic route by order ID */}
          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* User orders listing page */}
          <Route path="/orders" element={<Orders />} />

          {/* Admin page for managing users */}
          <Route path="/admin/users" element={<UserManagement />} />

          {/* Admin page for managing products */}
          <Route path="/admin/products" element={<ProductManagement />} />

          {/* Admin page for managing orders */}
          <Route path="/admin/orders" element={<OrderManagement />} />
        </Routes>
      </main>

      {/* Footer component */}
      <Footer />

      {/* Toast notification container with configuration */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
