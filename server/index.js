import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {Admin, Cart, Orders, Product, User } from './Schema.js'
import jwt from "jsonwebtoken";
import { verifyToken } from './middleware/auth.js';


const app = express();
const JWT_SECRET = process.env.JWT_SECRET; // move to .env in future

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = 6001;

mongoose.connect('mongodb://localhost:27017/shop',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
            console.log("data base connected");
    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        try {
          
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username, email, usertype, password: hashedPassword
            });
            const userCreated = await newUser.save();
            return res.status(201).json(userCreated);

        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });





app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user._id, usertype: user.usertype },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                usertype: user.usertype
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});


    // fetch banner

    app.get('/fetch-banner',verifyToken, async(req, res)=>{
        try{
            const admin = await Admin.findOne();
            res.json(admin.banner || []);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })

    app.delete('/delete-banner/:index', verifyToken, async (req, res) => {
  try {
    const { index } = req.params;
    const admin = await Admin.findOne();

    if (!admin.banner || admin.banner.length <= index) {
      return res.status(400).json({ message: 'Invalid index' });
    }

    admin.banner.splice(index, 1); // remove the banner
    await admin.save();
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});
    // fetch users

    app.get('/fetch-users',verifyToken, async(req, res)=>{
        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })

     // Fetch individual product
     app.get('/fetch-product-details/:id',verifyToken, async(req, res)=>{
        const id = req.params.id;
        try{
            const product = await Product.findById(id);
            res.json(product);
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // fetch products

    app.get('/fetch-products',verifyToken, async(req, res)=>{
        try{
            const products = await Product.find();
            res.json(products);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })

    // fetch orders

    app.get('/fetch-orders',verifyToken, async(req, res)=>{
        try{
            const orders = await Orders.find();
            res.json(orders);

        }catch(err){
            res.status(500).json({ message: 'Error occured' });
        }
    })


    // Fetch categories
app.get('/fetch-categories', verifyToken, async(req, res) => {
  try {
    const admin = await Admin.findOne();
    res.json(admin.categories); // This should be an array of strings
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});


    // to get categories with their first product image
app.get('/category-preview', verifyToken, async (req, res) => {
  try {
    const categories = await Admin.findOne(); // assuming single admin document
    const categoryList = categories?.categories || [];

    const results = await Promise.all(categoryList.map(async (cat) => {
      const product = await Product.findOne({ category: cat });
      return {
        category: cat,
        image: product?.mainImg || 'https://via.placeholder.com/300x200?text=No+Image',
      };
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category previews' });
  }
});

    // Add new product

    app.post('/add-new-product',verifyToken, async(req, res)=>{
        const {productName, productDescription, productMainImg, productCarousel, productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount} = req.body;
        try{
            if(productCategory === 'new category'){
                const admin = await Admin.findOne();
                admin.categories.push(productNewCategory);
                await admin.save();
                const newProduct = new Product({title: productName, description: productDescription, mainImg: productMainImg, carousel: productCarousel, category: productNewCategory,sizes: productSizes, gender: productGender, price: productPrice, discount: productDiscount});
                await newProduct.save();
            } else{
                const newProduct = new Product({title: productName, description: productDescription, mainImg: productMainImg, carousel: productCarousel, category: productCategory,sizes: productSizes, gender: productGender, price: productPrice, discount: productDiscount});
                await newProduct.save();
            }
            res.json({message: "product added!!"});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // update product

    app.put('/update-product/:id',verifyToken, async(req, res)=>{
        const {productName, productDescription, productMainImg, productCarousel, productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount} = req.body;
        try{
            if(productCategory === 'new category'){
                const admin = await Admin.findOne();
                admin.categories.push(productNewCategory);
                await admin.save();

                const product = await Product.findById(req.params.id);

                product.title = productName;
                product.description = productDescription;
                product.mainImg = productMainImg;
                product.carousel = productCarousel;
                product.category = productNewCategory;
                product.sizes = productSizes;
                product.gender = productGender;
                product.price = productPrice;
                product.discount = productDiscount;

                await product.save();
               
            } else{
                const product = await Product.findById(req.params.id);

                product.title = productName;
                product.description = productDescription;
                product.mainImg = productMainImg;
                product.carousel = productCarousel;
                product.category = productCategory;
                product.sizes = productSizes;
                product.gender = productGender;
                product.price = productPrice;
                product.discount = productDiscount;

                await product.save();
            }
            res.json({message: "product updated!!"});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


    // Update banner

    app.post('/update-banner', verifyToken, async (req, res) => {
  const { banner } = req.body; // must be an array
  try {
    const admin = await Admin.findOne();
    admin.banner = banner;
    await admin.save();
    res.json({ message: "Banner updated" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});


    


    // buy product

    app.post('/buy-product',verifyToken, async(req, res)=>{
        const {userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate} = req.body;
        try{

            const newOrder = new Orders({userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate})
            await newOrder.save();
            res.json({message: 'order placed'});

        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


   
    // cancel order

    app.put('/cancel-order',verifyToken, async(req, res)=>{
        const {id} = req.body;
        try{

            const order = await Orders.findById(id);
            order.orderStatus = 'cancelled';
            await order.save();
            res.json({message: 'order cancelled'});

        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


    // update order status

    app.put('/update-order-status',verifyToken, async(req, res)=>{
        const {id, updateStatus} = req.body;
        try{

            const order = await Orders.findById(id);
            order.orderStatus = updateStatus;
            await order.save();
            res.json({message: 'order status updated'});

        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


    // fetch cart items

    app.get('/fetch-cart',verifyToken, async(req, res)=>{
        try{
            
            const items = await Cart.find();
            res.json(items);

        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


    // add cart item

    app.post('/add-to-cart', async(req, res)=>{

        const {userId, title, description, mainImg, size, quantity, price, discount} = req.body
        try{

            const item = new Cart({userId, title, description, mainImg, size, quantity, price, discount});
            await item.save();

            res.json({message: 'Added to cart'});
            
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


    // increase cart quantity

    app.put('/increase-cart-quantity',verifyToken, async(req, res)=>{
        const {id} = req.body;
        try{
            const item = await Cart.findById(id);
            item.quantity = parseInt(item.quantity) + 1;
            item.save();

            res.json({message: 'incremented'});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })

    // decrease cart quantity

    app.put('/decrease-cart-quantity',verifyToken, async(req, res)=>{
        const {id} = req.body;
        try{
            const item = await Cart.findById(id);
            item.quantity = parseInt(item.quantity) - 1;
            item.save();

            res.json({message: 'decremented'});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })


    // remove from cart

    app.put('/remove-item',verifyToken, async(req, res)=>{
        const {id} = req.body;
        try{
            const item = await Cart.deleteOne({_id: id});
            res.json({message: 'item removed'});
        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    });


    // Order from cart

    app.post('/place-cart-order',verifyToken, async(req, res)=>{
        const {userId, name, mobile, email, address, pincode, paymentMethod, orderDate} = req.body;
        try{

            const cartItems = await Cart.find({userId});
            cartItems.map(async (item)=>{

                const newOrder = new Orders({userId, name, email, mobile, address, pincode, title: item.title, description: item.description, mainImg: item.mainImg, size:item.size, quantity: item.quantity, price: item.price, discount: item.discount, paymentMethod, orderDate})
                await newOrder.save();
                await Cart.deleteOne({_id: item._id})
            })
            res.json({message: 'Order placed'});

        }catch(err){
            res.status(500).json({message: "Error occured"});
        }
    })



    app.listen(PORT, ()=>{
        console.log('running @ 6001');
    })
}).catch((e)=> console.log(`Error in db connection ${e}`));