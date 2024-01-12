import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderByUserIdAsync, selectOrders } from '../OrderSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Button, Paper, Stack, Typography } from '@mui/material'
import {Link} from 'react-router-dom'
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice'

export const UserOrders = () => {

    const dispatch=useDispatch()
    const loggedInUser=useSelector(selectLoggedInUser)
    const orders=useSelector(selectOrders)
    const cartItems=useSelector(selectCartItems)

    useEffect(()=>{
        dispatch(getOrderByUserIdAsync(loggedInUser?._id))
    },[dispatch])


    const handleAddToCart=(product)=>{
        const item={user:loggedInUser._id,product:product._id,quantity:1}
        dispatch(addToCartAsync(item))
    }


  return (
    <Stack justifyContent={'center'} alignItems={'center'}>

        <Stack width={'60rem'} p={4}>

        
            <Stack>
                <Typography variant='h4' gutterBottom fontWeight={500}>Order history</Typography>
                <Typography color={'text.secondary'}>Check the status of recent orders, manage returns, and discover similar products.</Typography>
            </Stack>


            <Stack mt={5} rowGap={5} >

                    {
                        orders && orders.map((order)=>(
                            <Stack p={2} component={Paper} elevation={1} rowGap={2}>
                                
                                {/* upper */}
                                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                    <Stack flexDirection={'row'} columnGap={4}>
                                        <Stack>
                                            <Typography>Order Number</Typography>
                                            <Typography color={'text.secondary'}>{order._id}</Typography>
                                        </Stack>

                                        <Stack>
                                            <Typography>Date Placed</Typography>
                                            <Typography color={'text.secondary'}>{new Date(order.createdAt).toDateString()}</Typography>
                                        </Stack>

                                        <Stack>
                                            <Typography>Total Amount</Typography>
                                            <Typography>${order.total}</Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack>
                                        <Typography>Quantity: {order.item.length}</Typography>
                                    </Stack>
                                </Stack>

                                {/* middle */}
                                <Stack rowGap={2}>

                                    {
                                        order.item.map((product)=>(
                                            
                                            <Stack mt={2} flexDirection={'row'} columnGap={4}>
                                                <Stack width={'300px'}>
                                                    <img style={{width:"100%",height:"100%",objectFit:"contain"}} src={product.product.images[0]} alt="" />
                                                </Stack>

                                                <Stack rowGap={1} width={'100%'}>

                                                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                                        <Stack>
                                                            <Typography variant='h6' fontSize={'1rem'} fontWeight={500}>{product.product.title}</Typography>
                                                            <Typography variant='body1'  fontSize={'.9rem'}  color={'text.secondary'}>{product.product.brand.name}</Typography>
                                                            <Typography color={'text.secondary'} fontSize={'.9rem'}>Qty: {product.quantity}</Typography>
                                                        </Stack>
                                                        <Typography>${product.product.price}</Typography>
                                                    </Stack>

                                                    <Typography color={'text.secondary'}>{product.product.description}</Typography>

                                                    <Stack mt={2} alignSelf={'flex-end'} flexDirection={'row'} columnGap={2} >
                                                        <Button size='small' component={Link} to={`/product-details/${product.product._id}`} variant='outlined'>View Product</Button>
                                                        {
                                                            cartItems.some((cartItem)=>cartItem.product._id===product.product._id)?
                                                            <Button  size='small' variant='contained' component={Link} to={"/cart"}>Already in Cart</Button>
                                                            :<Button  size='small' variant='contained' onClick={()=>handleAddToCart(product.product)}>Buy Again</Button>
                                                        }
                                                    </Stack>

                                                </Stack>



                                            </Stack>
                                        ))
                                    }

                                </Stack>

                                {/* lower */}
                                <Stack mt={2} flexDirection={'row'} justifyContent={'space-between'}>
                                    <Typography>Status : {order.status}</Typography>
                                </Stack>
                                    
                            </Stack>
                        ))
                    }

            </Stack>
        
        </Stack>

    </Stack>
  )
}
