import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import ProductPage from './pages/ProductPage';
import { Helmet } from 'react-helmet';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProductDetail from './pages/ProductDetailPage';
import ShoppingCart from './pages/ShoppingCartPage';
import SubmitOrder from './pages/SubmitOrderPage';
import ProfilePage from './pages/ProfilePage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import RequestQuotationsPage from './pages/RequestQuotationsPage';
import ErrorPage from './pages/ErrorPage';
import AdminQuotationPage from './pages/AdminQuotationPage';
import ClientOrderPage from './pages/ClientOrderPage';
import PurchaseSucess from './pages/PurchaseSuccess';
import PurchaseCancel from './pages/PurchaseCancel';

function App() {
  return (
    <div>
      <Helmet>
        <meta http-equiv="Content-Security-Policy" content="frame-src 'self' https://maps.google.com https://www.google.com;" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet" />
        <title>Galang Glass Aluminum</title>
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/products/:id" element={<ProductDetail/>} />
          <Route path="/shoppingCart" element={<ShoppingCart/>} />
          <Route path="/submit-order" element={<SubmitOrder/>} />
          <Route path="/client-order" element={<ClientOrderPage/>} />
          <Route path="/adminOrders" element={<AdminOrdersPage />} />
          <Route path="/request-quotation" element={<RequestQuotationsPage/>} />
          <Route path="*" element={<ErrorPage />} /> 
          <Route path="/admin-quotation" element={<AdminQuotationPage/>} />
          <Route path="/success" element={<PurchaseSucess/>} />
          <Route path="/cancel" element={<PurchaseCancel/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
