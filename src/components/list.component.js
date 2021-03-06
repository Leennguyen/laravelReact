import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'

export default function List() {

    const [cars, setCars] = useState([])

    useEffect(()=>{
        fetchCars()
    },[])

    const fetchCars = async () => {
        await axios.get(`http://localhost:8000/api/cars`).then(({data})=>{
            setCars(data)
        })
    }

    const deleteCar = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            return result.isConfirmed
        });

        if(!isConfirm){
            return;
        }

        await axios.delete(`http://localhost:8000/api/cars/${id}`).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchCars()
        }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
        })
    }

    return (
        <div className="container">
            <div className="car">
                <div className='col-12'>
                    <Link className='btn btn-primary mb-2 float-end' to={"/Car/create"}>
                        Create Car
                    </Link>
                </div>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    cars.length > 0 && (
                                        cars.map((car, key)=>(
                                            <tr key={key}>
                                                <td>{car.name_car}</td>
                                                <td>{car.price}</td>
                                                <td>
                                                    <img width="50px" alt="" src={`http://localhost:8000/images/${car.img}`} />
                                                </td>
                                                <td>
                                                    <Link to={`/Car/edit/${car.id}`} className='btn btn-success me-2'>
                                                        Edit
                                                    </Link>
                                                    <Button variant="danger" onClick={()=>deleteCar(car.id)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}