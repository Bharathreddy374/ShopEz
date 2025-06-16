import React, { useEffect, useState } from 'react';
import '../styles/FlashSale.css';
import axios from 'axios';

const FlashSale = () => {
  const [flashProducts, setFlashProducts] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchFlashProducts();
  }, []);

  const fetchFlashProducts = async () => {
    try {
      const res = await axios.get("http://localhost:6001/fetch-products", config);
      const discounted = res.data.filter(p => p.discount >= 5); // Products with discount >= 5%
      setFlashProducts(discounted.slice(0, 6)); // Show up to 6
    } catch (err) {
      console.error("Failed to fetch flash sale products:", err);
    }
  };

  return (
     <div className="flashSaleContainer">
        <h3>Flash sale</h3>
        <div className="flashSale-body">


        {flashProducts.length === 0 ? (
          <p style={{ padding: '1rem' }}>No discounted products right now.</p>
        ) : (
          flashProducts.map((product) => (
            <div className="flashSaleCard" key={product._id}>
              <img src={product.mainImg} alt={product.title} />
              <div className="flashSaleCard-data">
                <h6>{product.title}</h6>
                <p>{product.description.slice(0, 40)}...</p>
                <h5>{product.discount}% off</h5>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FlashSale;


