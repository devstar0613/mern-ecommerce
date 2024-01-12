import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProductByIdAsync,resetProductUpdateStatus, selectProductUpdateStatus, selectSelectedProduct, updateProductByIdAsync } from '../../products/ProductSlice'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useForm } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'

export const ProductUpdate = () => {

    const {register,handleSubmit,watch,formState: { errors }} = useForm()

    const {id}=useParams()
    const dispatch=useDispatch()
    const selectedProduct=useSelector(selectSelectedProduct)
    const brands=useSelector(selectBrands)
    const categories=useSelector(selectCategories)
    const productUpdateStatus=useSelector(selectProductUpdateStatus)
    const navigate=useNavigate()

    useEffect(()=>{
        if(id){
            dispatch(fetchProductByIdAsync(id))
        }
    },[id])

    useEffect(()=>{
        if(productUpdateStatus==='fullfilled'){
            toast.success("Product Updated")
            navigate("/admin/dashboard")
        }
        else if(productUpdateStatus==='rejected'){
            toast.error("Error updating product, please try again later")
        }

        return ()=>{
            dispatch(resetProductUpdateStatus())
        }
    },[productUpdateStatus])

    const handleProductUpdate=(data)=>{
        const productUpdate={...data,_id:selectedProduct._id,images:[data?.image0,data?.image1,data?.image2,data?.image3]}
        delete productUpdate?.image0
        delete productUpdate?.image1
        delete productUpdate?.image2
        delete productUpdate?.image3

        dispatch(updateProductByIdAsync(productUpdate))
    }


  return (
    <Stack justifyContent={'center'} alignItems={'center'} flexDirection={'row'} >
        

        <Stack width={'60rem'} rowGap={4} mt={6} mb={6} component={'form'} noValidate onSubmit={handleSubmit(handleProductUpdate)}> 
            
            {/* feild area */}
            <Stack rowGap={3}>
                <Stack>
                    <Typography variant='h6' fontWeight={400} gutterBottom>Title</Typography>
                    <TextField {...register("title",{required:'Title is required',value:selectedProduct?.title})}/>
                </Stack> 

                <Stack flexDirection={'row'} >

                    <FormControl fullWidth>
                        <InputLabel id="brand-selection">Brand</InputLabel>
                        <Select defaultValue={selectedProduct?.brand._id} {...register("brand",{required:"Brand is required"})} labelId="brand-selection" label="Brand">
                            
                            {
                                brands.map((brand)=>(
                                    <MenuItem value={brand._id}>{brand.name}</MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>


                    <FormControl fullWidth>
                        <InputLabel id="category-selection">Category</InputLabel>
                        <Select defaultValue={selectedProduct?.category._id} {...register("category",{required:"category is required"})} labelId="category-selection" label="Category">
                            
                            {
                                categories.map((category)=>(
                                    <MenuItem value={category._id}>{category.name}</MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>

                </Stack>


                <Stack>
                    <Typography variant='h6' fontWeight={400}  gutterBottom>Description</Typography>
                    <TextField multiline rows={4} {...register("description",{required:"Description is required",value:selectedProduct?.description})}/>
                </Stack>

                <Stack flexDirection={'row'}>
                    <Stack flex={1}>
                        <Typography variant='h6' fontWeight={400}  gutterBottom>Price</Typography>
                        <TextField type='number' {...register("price",{required:"Price is required",value:selectedProduct?.price})}/>
                    </Stack>
                    <Stack flex={1}>
                        <Typography variant='h6' fontWeight={400}  gutterBottom>Discount Percentage</Typography>
                        <TextField type='number' {...register("discountPercentage",{required:"discount percentage is required",value:selectedProduct?.discountPercentage})}/>
                    </Stack>
                </Stack>

                <Stack>
                    <Typography variant='h6'  fontWeight={400} gutterBottom>Stock Quantity</Typography>
                    <TextField type='number' {...register("stockQuantity",{required:"Stock Quantity is required",value:selectedProduct?.stockQuantity})}/>
                </Stack>
                <Stack>
                    <Typography variant='h6'  fontWeight={400} gutterBottom>Thumbnail</Typography>
                    <TextField {...register("thumbnail",{required:"Thumbnail is required",value:selectedProduct?.thumbnail})}/>
                </Stack>

                <Stack>
                    <Typography variant='h6'  fontWeight={400} gutterBottom>Product Images</Typography>

                    <Stack rowGap={2}>
                        {
                            selectedProduct?.images.map((image,index)=>(
                                <TextField {...register(`image${index}`,{required:"Image is required",value:image})}/>
                            ))
                        }
                    </Stack>

                </Stack>

            </Stack>


            {/* action area */}
            <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={2}>
                <Button size='large' variant='contained' type='submit'>Update</Button>
                <Button size='large' variant='outlined' color='error' component={Link} to={'/admin/dashboard'}>Cancel</Button>
            </Stack>


        </Stack>

    </Stack>
  )
}